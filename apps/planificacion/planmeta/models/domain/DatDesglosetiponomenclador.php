<?php

class DatDesglosetiponomenclador extends BaseDatDesglosetiponomenclador
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTiponomenclador', array('local'   => 'idtiponomenclador',
                                        'foreign' => 'idtiponomenclador')
        );
        $this->hasOne(
            'DatDesglose',
            array('local' => 'iddesglose', 'foreign' => 'iddesglose')
        );
        $this->hasMany(
            'DatDesglosecompleto', array('local'   => 'iddesglosetiponomenclador',
                                         'foreign' => 'iddesglosetiponomenclador')
        );
        $this->hasMany(
            'DatDesglosedatosnomenclador',
            array('local'   => 'iddesglosetiponomenclador',
                  'foreign' => 'iddesglosetiponomenclador')
        );
    }

    public function listar($parametros,$params)
    {
        $query = new Doctrine_Query();
        $querytotal = new Doctrine_Query();

        $query->select("dtn.*,tn.denominacion,tn.descripcion")
            ->from('DatDesglosetiponomenclador dtn')
            ->innerJoin('dtn.NomTiponomenclador tn')
            ->addWhere('dtn.iddesglose = ?', $parametros['iddesglose']);


        if ($params!=null||$params!='') {
            foreach ($params as $p => $s) {
                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere(
                            "upper(tn.denominacion) LIKE '%" . strtoupper($s)
                            . "%'"
                        );
                    }
                    if ($p == 'descripcion') {
                        $query->addWhere(
                            "upper(tn.descripcion) LIKE '%" . strtoupper($s)
                            . "%'"
                        );
                    } if ($p == 'orden') {
                        $a=$s['datos'];
                        if($s['signo']=='gt'){
                        $query->addWhere( "dtn.orden > $a"
                            );
                        }else{
                            { if($s['signo']=='lt'){
                                $query->addWhere("dtn.orden < $a"
                                );
                            }else{ $query->addWhere("dtn.orden = $a"
                            );}
                            }}
                        }
                }}}



        $data->data = $query ->offset($parametros['start'])
            ->limit($parametros['limit'])
            ->orderby('dtn.orden')
            ->execute()->toArray(true);


        foreach ($data->data as $key => $valor) {
            $data->data[$key]['denominacion']
                = $data->data[$key]['NomTiponomenclador']['denominacion'];
            $data->data[$key]['descripcion']
                = $data->data[$key]['NomTiponomenclador']['descripcion'];
        }
        $data->total = $querytotal
            ->select("COUNT(*) as total")
            ->from('DatDesglosetiponomenclador dtn')
            ->innerJoin('dtn.NomTiponomenclador tn')
            ->addWhere('dtn.iddesglose = ?', $parametros['iddesglose'])
            ->execute()->getFirst()->total;

        return $data;
    }

    public function getDatDesglosetiponomenclador($iddesglose)
    {
        $query = new Doctrine_Query();
        return $query->from('DatDesglosetiponomenclador dtn')
            ->innerJoin('dtn.NomTiponomenclador tn')
            ->addWhere('dtn.iddesglose = ?', $iddesglose)->orderby('dtn.orden')
            ->execute();
    }

    public function getDatDesglosetiponomencladorPorDesgloseYOrden($iddesglose,
        $orden
    )
    {
        $query = new Doctrine_Query();
        return $query->from('DatDesglosetiponomenclador dtn')
            ->where(
                'dtn.iddesglose = ? AND dtn.orden = ?',
                array($iddesglose, $orden)
            )->execute()->getFirst();
    }

    public function validarOcurrenciaDeTodosNomencladores($arrayIdtiposnomenclador
    )
    {
        $query = new Doctrine_Query();
        $arrayIdstn = array();

        $strAtributos = "";
        $coma = "";
        $arrayParametros = array();
        $arrayParametros[0] = 0; //cantidad de idstiponomencladores ingresados
        foreach ($arrayIdtiposnomenclador as $datosIdtn) {
            $arrayIdstn[] = $datosIdtn->idtiponomenclador;
            $arrayParametros[] = $datosIdtn->idtiponomenclador;
            $strAtributos = $strAtributos . $coma . '?';
            $coma = ",";
            $arrayParametros[0]++;
        }
        $arrayIdtiposnomenclador = null;
        $arrayParametros[]
            = $arrayParametros[0]; //cantidad de idstiponomencladores ingresados

        $conn = Doctrine_Manager:: connection();
        $query
            = " SELECT dtn1.iddesglose
                        FROM mod_planificacion.dat_desglosetiponomenclador dtn1
                        WHERE dtn1.iddesglose IN(
                        SELECT dtn2.iddesglose
                        FROM mod_planificacion.dat_desglosetiponomenclador dtn2
                        WHERE dtn2.iddesglose = dtn1.iddesglose
                        GROUP BY dtn2.iddesglose
                        HAVING COUNT(dtn2.iddesglosetiponomenclador) = ?
                        ) AND dtn1.idtiponomenclador IN ($strAtributos)
                        GROUP BY dtn1.iddesglose
                        HAVING COUNT(dtn1.iddesglosetiponomenclador)  = ?
                        LIMIT 1 OFFSET 0";
        $res = $conn->execute($query, $arrayParametros);
        $result = $res->fetchAll();

        if ($result[0]['iddesglose'] != null) {
            return false;
        }

        return true;
    }

    public function buscarDesglose($iddesglosetiposnomenclador)
    {
        $conn = Doctrine_Manager:: connection();
        $query
            = " SELECT dtn1.iddesglose
                        FROM mod_planificacion.dat_desglosetiponomenclador dtn1
                        
                        WHERE dtn1.iddesglosetiponomenclador = $iddesglosetiposnomenclador";
        $res = $conn->execute($query);
        $result = $res->fetchAll();
        return $result[0]['iddesglose'];
    }

    public function buscarTabla($idtipomodelo)
    {
        $conn = Doctrine_Manager:: connection();
        $query
            = " SELECT dtn1.idtabla FROM mod_planificacion.nom_tipomodelo dtn1
                WHERE dtn1.idtipomodelo = $idtipomodelo";
        $res = $conn->execute($query);
        $result = $res->fetchAll();
        return $result[0]['idtabla'];
    }

    public function buscarConfiguracionConColumnasNomencladas($arrayIdtiposnomenclador
    )
    {
        $query = new Doctrine_Query();

        $strAtributos = "";
        $coma = "";
        $arrayParametros = array();
        $arrayParametros[0] = 0; //cantidad de idstiponomencladores ingresados
        foreach ($arrayIdtiposnomenclador as $datosIdtn) {
            $arrayParametros[] = $datosIdtn;
            $strAtributos = $strAtributos . $coma . '?';
            $coma = ",";
            $arrayParametros[0]++;
        }
        $arrayIdtiposnomenclador = null;
        $arrayParametros[]
            = $arrayParametros[0]; //cantidad de idstiponomencladores ingresados

        $conn = Doctrine_Manager:: connection();
        $query
            = " SELECT dtn1.iddesglose
                        FROM mod_planificacion.dat_desglosetiponomenclador dtn1
                        WHERE dtn1.iddesglose IN(
                        SELECT dtn2.iddesglose
                        FROM mod_planificacion.dat_desglosetiponomenclador dtn2
                        WHERE dtn2.iddesglose = dtn1.iddesglose
                        GROUP BY dtn2.iddesglose
                        HAVING COUNT(dtn2.iddesglosetiponomenclador) = ?
                        ) AND dtn1.idtiponomenclador IN ($strAtributos)
                        GROUP BY dtn1.iddesglose
                        HAVING COUNT(dtn1.iddesglosetiponomenclador)  = ?
                        LIMIT 1 OFFSET 0";
        $res = $conn->execute($query, $arrayParametros);
        $result = $res->fetchAll();
        return $result[0]['iddesglose'];
    }

    public function getTipoNomenclador($iddesglose, $orden)
    {
        $query = new Doctrine_Query();
        return $query->from('DatDesglosetiponomenclador dtn')
            ->addWhere('dtn.iddesglose = ?', $iddesglose)
            ->addWhere('dtn.orden = ?', $orden)->execute()->getFirst();
    }

    public function esUltimoNivel($iddesglose, $orden)
    {
        $query = new Doctrine_Query();
        $confdesglose = $query->from('DatDesglosetiponomenclador')
            ->addWhere('iddesglose = ?', $iddesglose)
            ->addWhere('orden = ?', $orden)
            ->addWhere(
                'orden IN(
                                                    SELECT MAX( dat_desglosetiponomenclador.orden )
                                                    FROM dat_desglosetiponomenclador
                                                    WHERE dat_desglosetiponomenclador.iddesglose = ?
                                                    )', $iddesglose
            )->execute()->getFirst();
        if ($confdesglose->iddesglosetiponomenclador != null) {
            return true;
        } else {
            return false;
        }
    }

}

//fin clase

