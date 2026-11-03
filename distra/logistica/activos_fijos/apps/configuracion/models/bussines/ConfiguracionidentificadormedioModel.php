<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 3/24/2016
 * Time: 4:40 PM
 */
class ConfiguracionidentificadormedioModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::__construct();

    }

    /**
     * Método para cargar todos los atributos configurados de un indicador
     *
     * @param $idindicador id del indicador
     *
     * @return array
     */
    public function cargarAtributosPorIndicador($idindicador)
    {
        $arrayIds = array();
        $identificadores = array();
        $denominaciones = array();
        $arrayResultados = array();
        $campos = $this->devolverIndicadoresIdCampo($idindicador);
        foreach ($campos as $index => $row) {
            $arrayIds[$index] = $row['idatributodinamico'];
            $identificadores[$index] = $row['identificador'];
            $denominaciones[$index] = $row['nombretabla'];
        }
        if ($arrayIds) {
            $resp = $this->devolverAtributosDinamicoIndicador($idindicador);;
            $etiquetasCampos = array();
            foreach ($resp as $k => $row) {
                $etiquetasCampos[$k]['idcampo'] = $row['idcampo'];
                $etiquetasCampos[$k]['label'] = $row['denominacion'];
                $etiquetasCampos[$k]['longitud'] = $row['longitud'];
                $etiquetasCampos[$k]['tipocomp'] = $row['idtipocomponente'];
                $etiquetasCampos[$k]['identificador'] = $identificadores[$k];
                $etiquetasCampos[$k]['nombretabla'] = $denominaciones[$k];
            }
        }

        return $etiquetasCampos;
    }

    /**
     * Método para devolver los idscampos de los atributos dinamicos de un indicador
     *
     * @param $idindicador id del indicador
     *
     * @return array
     */
    public function devolverIndicadoresIdCampo($idindicador)
    {
        if ($idindicador) {
            $query = new Doctrine_Query();
            $query->from('CfgIdentificadorMedio cfg')
                ->whereIn('cfg.idindicador', $idindicador)
                ->orderBy('cfg.idindicador');
            $result = $query->fetchArray();
            return $result;
        }
    }

    /**
     * Método para devolver los atributos dinamicos de un indicador
     *
     * @param $idindicador id del indicador
     *
     * @return array
     */

    public function devolverAtributosDinamicoIndicador($idindicador)
    {
        $idsCampos = $this->devolverIndicadoresIdCampo($idindicador);
        $result = array();
        $data = array();
        if ($idsCampos) {
            $idcampo = array();
            $identificadores = array();
            $names = array();
            foreach ($idsCampos as $index => $row) {
                $idcampo[] = $row['idatributodinamico'];
                $identificadores[] = $row['identificador'];
                $recuperables[] = $row['recuperable'];
                $names[] = $row['nombretabla'];
            }
            $query = new Doctrine_Query();
            foreach ($idcampo as $row) {
                $query->select(
                    'f.idcampo as idcampo, f.longitud as longitud, cp.etiqueta as denominacion,
                    cp.idtipocomponente as idtipocomponente'
                )
                    ->from('DatCampo f')
                    ->innerJoin('f.DatComponente cp')
                    ->where("f.idcampo = {$row}");
                $data = $query->fetchArray();
                $result[] = $data[0];
            }
            foreach ($result as $index => $row) {
                $data[$index]['idcampo'] = $row['idcampo'];
                $data[$index]['longitud'] = $row['longitud'];
                $data[$index]['denominacion'] = $row['denominacion'];
                $data[$index]['identificador'] = $identificadores[$index];
                $data[$index]['recuperable'] = $recuperables[$index];
                $data[$index]['idindicador'] = $idindicador;
                $data[$index]['name'] = $names[$index];
                $data[$index]['tipocomponente'] = $this->devolverTipoComponente(
                    $row['idtipocomponente']
                );
                $data[$index]['idtipocomponente'] = $row['idtipocomponente'];
            }
            return $data;
        }
    }

    public function obtenerAtributosIndicador($arreglo, $parametros)
    {
        $confTipomedio = new ConfiguracionActivosService();
//        $result = $confTipomedio->getConfDatPorNaturaleza($idnaturaleza, $identidad);

        $configuracionService = ServiciosConfiguracionGeneralHelper::__init();
        $confDinamicos = $configuracionService->getAtributosAgrupacionIndicador($arreglo);
        $dinamicos = array();
        if (count($confDinamicos > 0) && $confDinamicos) {
            $query = new Doctrine_Query();
            $query->from('DatTabla dt');
            $query->where('dt.idtabla =?', array($parametros['idtabla']));
            $respuesta = $query->fetchArray();
            foreach ($confDinamicos as $din) {
                $dinamicos[] = array('identificador'    => $respuesta[0]['esquema'] . "." . $respuesta[0]['tabla'] . "."
                    . $din->nameInTabla, 'denominacion' => $din->label);

            }
        }

        return $dinamicos;

    }

    public function obtenerIndicadores($params)
    {
        $params['limit']=25;
        ComunAFTModel::getInstance()->configStartAndLimitInParams(
            $params, $params['start'], $params['limit']
        );

        new CfgIdentificadorMedio();
        $query = new Doctrine_Query();
        $query->select(
            'cfg.*, i.denominacion as indicador, i.idnaturaleza as idnaturaleza, i.idtabla as idtabla, i.idtablageneral as idtablageneral, marca.denominacion as marca, modelo.denominacion as modelo'
        );
        $query->addSelect(
            "(
               (Case When ih.idmarca is not null
                Then (i.denominacion ||'  '|| marca.denominacion ||
                (Case When ih.idmodelo is not null Then '   ' Else '' End))
                Else i.denominacion
               End) ||

              (Case When ih.idmodelo is not null Then modelo.denominacion Else '' End)

             )
             as denominacionIndicador"
        );



        $query->from('CfgIdentificadorMedio cfg');
        $query->innerJoin('cfg.NomIndicador i ');
        $query->innerJoin('i.NomIndicadorhoja ih ');
        $query->leftJoin('ih.NomMarca marca ');
        $query->leftJoin('ih.NomModelo modelo ');

        $total = $query->count();

        if ($params['limit']) {
            $query->offset($params['start']);
            $query->limit($params['limit']);
        }
        $datos = $query->fetchArray();
        $resp = array('datos' => $datos, 'cantidad' => $total);

        return $resp;
    }

    public function adicionarRelacion($datos)
    {
        $objetoBD = Doctrine::getTable('CfgIdentificadorMedio')
            ->findByDql('idindicador = ?', array($datos['idindicador']));

        if (!$objetoBD) {
            $objeto = new CfgIdentificadorMedio();
        } else {
            $objeto = $objetoBD[0];
        }
        $objeto->synchronizeWithArray($datos);

        $objeto->save();
    }

    /*
     *
     * */
    public function eliminarRelacion($idindicador)
    {
        //$query = new Doctrine_Query();
        //$query->delete()->from('CfgIdentificadorMedio c')->where('c.idindicador = ?', array($idindicador))->execute();
        if($idindicador){
            $conn = Zend_Registry::get('conexion');
        $sql = "DELETE FROM mod_logactivofijotangible.conf_identificadormedio c WHERE c.idindicador = {$idindicador}";
            $conn->execute($sql);

        } else {
            throw new Exception('Falta el idindicador');
        }
    }

    public function getCamposIdentificador()
    {
        $query = new Doctrine_Query();
        $query->select('cfg.identificador, cfg.denominacion, cfg.nombretabla')
                ->from('CfgIdentificadorMedio cfg');
        return $query->fetchArray();
    }

    public function addJoinFromIndicador($query, $aliasExt = 'i', $aliasInterno = 'cfgIndMed', $addSelect = true,$tipoJoin = 'left'){

        new CfgIdentificadorMedio(); // Inicializando la realacion de indicador hachi la conftipomedio
        if($tipoJoin == 'left')
            $query->leftJoin("$aliasExt.CfgIdentificadorMedio $aliasInterno");
        else
            $query->innerJoin("$aliasExt.CfgIdentificadorMedio $aliasInterno");

        if($addSelect)
            $query = $this->addSelectQuery($query, $aliasInterno);

        return $query;
    }

    public function addSelectQuery($query, $alias = 'cfgIndMed'){
        $query->addSelect("$alias.ididentificadormedio as {$alias}_ididentificadormedio");
        $query->addSelect("$alias.idindicador as {$alias}_idindicador");
        $query->addSelect("$alias.identificador as {$alias}_identificador");
        $query->addSelect("$alias.denominacion as {$alias}_denominacion");
        $query->addSelect("$alias.nombretabla as {$alias}_nombretabla");
        return $query;
    }



} 