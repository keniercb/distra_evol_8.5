<?php

if (!class_exists('ComunAFTModel')) {
    $dirAFT = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/activos_fijos/comun/config.php';
    include_once $dirAFT;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class Submayorv2Model extends ZendExt_Model
{
    //private $sRegNumerico;
    private $mComunAFT, $mMaestroProd, $servicioEyC, $serviciosRecursosHumanos;

    public function __construct()
    {
        parent::ZendExt_Model();
        //$this->sRegNumerico = new RegNumericoService();
        $this->mComunAFT = ComunAFTModel::getInstance();
        //$this->mMaestroProd = new MaestroProgetConteoEntidadductoModel();
        $this->servicioEyC = ServiciosEstructuraComposicionHelper::__init();
        $this->serviciosRecursosHumanos = ServiciosRecursosHumanosHelper::__init();

        $this->idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $this->idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        //$this->idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;
    }

    public function cargarGrupoExplotacion($identidad)
    {
        $conn = Zend_Registry::get('conexion');
        $select = " select na.denominacion, na.idactividad
            FROM mod_logactivofijotangible.nom_actividad na
            INNER JOIN mod_logactivofijotangible.dat_actividadentidad da on da.idactividad = na.idactividad
            where da.idestructuracomun = $identidad
        ";
        $respDatos = $conn->execute($select)->fetchAll(
            PDO::FETCH_ASSOC
        );

       return $respDatos;

    }

    public function getNaturalezas($idnaturaleza = null){
        $conn = Zend_Registry::get('conexion');
        $select = " 
            select n.idnaturaleza as idnaturaleza
            from mod_datosmaestros.nom_naturaleza n";
        if($idnaturaleza != null){
            $select .= " where n.idarbol = $idnaturaleza";
        }
        $respDatos = $conn->execute($select)->fetchAll(PDO::FETCH_COLUMN);
       return $respDatos;
    }

    public function configureParams($params, $uiParams)
    {
        
        foreach ($params as $row) {
            if ($row->type == 'date')
                $row->value = date("Y-m-d",strtotime($row->value));
            if ($row->type == 'numeric' || $row->type == 'date') {
                if ($row->comparison == 'gt')
                    $uiParams['min_'.$row->field] = $row->value;
                if ($row->comparison == 'lt')
                    $uiParams['max_'.$row->field] = $row->value;
                if ($row->comparison != 'eq')
                    unset($uiParams[$row->field]);
                else $uiParams[$row->field] = $row->value;
            }
            if($row->field == 'naturaleza')
                $uiParams['idnaturaleza'] = $row->value;
            else if ($row->type == 'string')
                $uiParams[$row->field] = $row->value;
        }

        return $uiParams;
    }

    /*
     *  Devuelve los productos con las cantidades existencia y disponoble
     */

    public function getConteoEntidad($start = 0, $limit, $parametros, $arrIdesAreas)
    {
        if (!is_array($arrIdesAreas)) {
            $arrIdesAreas = $this->mComunAFT->getIdsAreasHijas();
        }

        if (count($arrIdesAreas) > 0) {
            // Este metodo en Dql no se puede hacer porque el distinct no pincha com debe, por lo que se hizo en sql.
            $estructurastring = " (" . implode(',', $arrIdesAreas) . ")";


            $select = "SELECT
                (
                    SELECT count(rn2.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn2
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON
                    rna.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
                    WHERE p.idindicador = i.idindicador
                    AND p.cronologia > 0 AND p.idestructura in $estructurastring AND rna.idestadoperacion = 1
                ) AS disponible,
                (
                    SELECT count(rn2.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn2
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON
                    rna.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
                    WHERE p.idindicador = i.idindicador
                    AND p.cronologia > 0 AND p.idestructura in $estructurastring AND
                    rna.idestadoperacion not in (0,7, 6, 8, 9)
                ) AS cantidad,
                    i.denominacion as denominacion,
                    i.codigo as codigo,
                    nat.denominacion as naturaleza,
                    marc.denominacion as marca,
                    marc.estado as marcaestado,
                    model.denominacion as modelo,
                    model.estado as modeloestado,
                    i.idindicador as idindicador,
                    i.numeropieza as numeropieza,
                    g.idgruposubgrupo as idgruposubgrupo,
                    g.denominacion as descripciongrupo
                ";
            $from
                = " FROM mod_datosmaestros.nom_indicador i
                      INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
                      INNER JOIN mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = i.idnaturaleza
                      LEFT JOIN mod_datosmaestros.nom_gruposubgrupo g on g.idgruposubgrupo = ih.idgruposubgrupo
                      LEFT JOIN mod_datosmaestros.nom_marca marc on ih.idmarca = marc.idmarca
                      LEFT JOIN mod_datosmaestros.nom_modelo model on ih.idmodelo = model.idmodelo";

            $where = " WHERE (SELECT p.idestructura FROM mod_logistica.dat_producto p
                      INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = p.idproducto
                      WHERE p.idindicador = i.idindicador
                      AND p.cronologia > 0
                      AND p.idestructura in $estructurastring
                      LIMIT 1
              ) IS NOT NULL AND ih.explotacion = 1";

            $groupby
                = " GROUP BY i.idindicador,
                        i.denominacion,
                        i.codigo,
                        nat.denominacion,
                        marc.denominacion,
                        marc.estado,
                        model.denominacion,
                        model.estado,
                        g.idgruposubgrupo
                        ORDER BY i.denominacion, marc.denominacion, model.denominacion
                    ";


            if ($parametros['denominacion']) {
                $where .= " AND i.denominacion ILIKE '%{$parametros['denominacion']}%' ";
            }
            if ($parametros['idmarca']) {
                $where .= " AND ih.idmarca = {$parametros['idmarca']} ";
            }
            if ($parametros['idmodelo']) {
                $where .= " AND ih.idmodelo = {$parametros['idmodelo']} ";
            }
            if ($parametros['marcamodelo']) {
                $where .= " AND (marc.denominacion ILIKE '%{$parametros['marcamodelo']}%'
                            OR model.denominacion ILIKE '%{$parametros['marcamodelo']}%')";
            }
            if ($parametros['idgruposubgrupo']) {
                $where .= " AND ih.idgruposubgrupo = {$parametros['idgruposubgrupo']} ";
            }
            
            if($parametros['solo_uh']){
                $where .= " AND ih.isuh = 1 ";
            }else{
                $where .= " AND ih.isuh <> 1 ";
            }
            
            $where = self::getConteoEntidadFilter($parametros, $where);
            $conn = Zend_Registry::get('conexion');

            if ($parametros['actividadGen']) {
                $actividad = json_decode(stripslashes($parametros['actividadGen']));
                $select .= $this->cargarSelectActividad($actividad, $estructurastring);
            }

            $sqlDatos = $select . $from . $where . $groupby;
            
            $sqlCount = 'SELECT count (distinct i.idindicador) ' . $from . $where;
            $datosPre = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
            $cantidadPre = 0;
            foreach ($datosPre as $value) {
                $cantidadPre += $value['cantidad'];
            }
            if ($start >= 0) {
                $sqlDatos .= " OFFSET $start LIMIT $limit";
            }

           
            $datos = $conn->execute($sqlDatos)->fetchAll(PDO::FETCH_ASSOC);
            $datos[0]['areas'] = $arrIdesAreas;

            $total = $conn->execute($sqlCount)->fetchAll(PDO::FETCH_ASSOC);
            $total = $total[0]['count'];
            return array('cantidad' => $total, 'datos' => $datos, 'cantidadTotal' => $cantidadPre);
        } else {
            return array('cantidad' => 0, 'datos' => array());
        }
    }

    public function getConteoEntidadFilter($parametros, $where)
    {
        if ($parametros['idespecialidadBuscar']) {
            $idespecialidad = $parametros['idespecialidadBuscar'];
            $where .= " AND i.idespecialidad = $idespecialidad";
        }
        if ($parametros['idnaturaleza']) {
            $idnaturaleza = (is_array($parametros['idnaturaleza'])) ? implode(",", $parametros['idnaturaleza'])
                : $parametros['idnaturaleza'];
            $where .= " AND i.idnaturaleza in ($idnaturaleza) ";
        }
        if ($parametros['naturaleza'] && is_array($parametros['naturaleza'])) {
            $naturalezas = implode(',', $parametros['naturaleza']);
            $where .= " AND nat.idnaturaleza IN ($naturalezas) ";
        }
        if ($parametros['descripciongrupo'] && is_array($parametros['descripciongrupo'])) {
            $descripciongrupo = implode(',', $parametros['descripciongrupo']);
            $where .= " AND g.idgruposubgrupo IN ($descripciongrupo) ";
        }
        if ($parametros['idnaturalezaNotIn']) {
            $idnaturaleza = (is_array($parametros['idnaturalezaNotIn'])) ? implode(
                ",", $parametros['idnaturalezaNotIn']
            ) : $parametros['idnaturalezaNotIn'];
            $where .= " AND i.idnaturaleza not in ($idnaturaleza) ";
        }
        if ($parametros['codigo']) {
            $where .= " AND i.codigo ILIKE '%{$parametros['codigo']}%' ";
        }
        
        return $where;
    }

    public function cargarSelectActividad($actividad, $estructurastring)
    {
        foreach ($actividad as $idactividad) {
            $select .= " ,(
                SELECT count(rn3.idregnumerico)
                FROM mod_logactivofijotangible.dat_registronumerico rn3
                INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna{$idactividad}
                ON rna{$idactividad}.idregnumerico = rn3.idregnumerico
                INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn3.idproducto
                WHERE p.idindicador = i.idindicador
                AND p.cronologia > 0 AND p.idestructura in $estructurastring AND rna{$idactividad}.idestadoperacion not in (0,7,6,8,9)
                AND rna{$idactividad}.idactividad = $idactividad
            ) AS activ{$idactividad} ";

        }
       return $select;
    }
}
