<?php

class DatTransicion extends BaseDatTransicion
{

    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'DatTransicionConfUsuario',
            array('local' => 'idtransicion', 'foreign' => 'idtransicion')
        );
        $this->hasOne(
            'ConfDoc', array('local' => 'idtipodoc', 'foreign' => 'idtipodoc')
        );
        $this->hasOne(
            'DatEstado',
            array('local' => 'idestadoinicial', 'foreign' => 'idestado')
        );
        $this->hasOne(
            'DatEstado',
            array('local' => 'idestadofinal', 'foreign' => 'idestado')
        );
        $this->HasMany(
            'DatCondicionTransicion',
            array('local' => 'idtransicion', 'foreign' => 'idtransicion')
        );
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatTransicion')->execute();
        return $result->toArray();
    }

    public function CargarTransicionTDoc($idtdoc, $start = 0, $limit = 10)
    {
        $result['data'] = Array();
        $conn = Zend_Registry::get('conexion');
        $inicial = $conn->execute(
                " SELECT mod_flujotrabajo.dat_estado.denominacion,
                mod_flujotrabajo.dat_estado.idestado,
                mod_flujotrabajo.dat_transicion.idtransicion,
                mod_flujotrabajo.dat_transicion.idestadoinicial
                FROM mod_flujotrabajo.dat_estado
                INNER JOIN mod_flujotrabajo.conf_doc_dat_estado 
                ON (mod_flujotrabajo.dat_estado.idestado = 
                mod_flujotrabajo.conf_doc_dat_estado.idestado)
                INNER JOIN mod_flujotrabajo.conf_doc 
                ON (mod_flujotrabajo.conf_doc_dat_estado.idtipodoc = 
                mod_flujotrabajo.conf_doc.idtipodoc)
                INNER JOIN mod_flujotrabajo.dat_transicion 
                ON (mod_flujotrabajo.conf_doc.idtipodoc = 
                mod_flujotrabajo.dat_transicion.idtipodoc)
                WHERE mod_flujotrabajo.conf_doc.idtipodoc='$idtdoc' and
                mod_flujotrabajo.dat_estado.idestado = 
                mod_flujotrabajo.dat_transicion.idestadoinicial
                ORDER by mod_flujotrabajo.dat_transicion.idtransicion
                limit $limit
                offset $start "
                );
        $final = $conn->execute(
                " SELECT mod_flujotrabajo.dat_estado.denominacion,
                mod_flujotrabajo.dat_estado.idestado,
                mod_flujotrabajo.dat_transicion.idtransicion,
                mod_flujotrabajo.dat_transicion.idestadofinal
                FROM mod_flujotrabajo.dat_estado
                INNER JOIN mod_flujotrabajo.conf_doc_dat_estado 
                ON (mod_flujotrabajo.dat_estado.idestado = 
                mod_flujotrabajo.conf_doc_dat_estado.idestado)
                INNER JOIN mod_flujotrabajo.conf_doc 
                ON (mod_flujotrabajo.conf_doc_dat_estado.idtipodoc = 
                mod_flujotrabajo.conf_doc.idtipodoc)
                INNER JOIN mod_flujotrabajo.dat_transicion 
                ON (mod_flujotrabajo.conf_doc.idtipodoc = 
                mod_flujotrabajo.dat_transicion.idtipodoc)
                WHERE mod_flujotrabajo.conf_doc.idtipodoc='$idtdoc' and
                mod_flujotrabajo.dat_estado.idestado = 
                mod_flujotrabajo.dat_transicion.idestadofinal
                ORDER by mod_flujotrabajo.dat_transicion.idtransicion
                limit $limit
                offset $start "
                );
        $cantidad = $conn->execute(
                " SELECT count(mod_flujotrabajo.dat_transicion.idtransicion) as cant
                FROM mod_flujotrabajo.dat_estado
                INNER JOIN mod_flujotrabajo.conf_doc_dat_estado 
                ON (mod_flujotrabajo.dat_estado.idestado = 
                mod_flujotrabajo.conf_doc_dat_estado.idestado)
                INNER JOIN mod_flujotrabajo.conf_doc 
                ON (mod_flujotrabajo.conf_doc_dat_estado.idtipodoc = 
                mod_flujotrabajo.conf_doc.idtipodoc)
                INNER JOIN mod_flujotrabajo.dat_transicion 
                ON (mod_flujotrabajo.conf_doc.idtipodoc = 
                mod_flujotrabajo.dat_transicion.idtipodoc)
                WHERE mod_flujotrabajo.conf_doc.idtipodoc= '$idtdoc' and
                mod_flujotrabajo.dat_estado.idestado = 
                mod_flujotrabajo.dat_transicion.idestadoinicial "
                );

        $temp['inicial'] = $inicial->fetchAll(PDO::FETCH_ASSOC);
        $temp['final'] = $final->fetchAll(PDO::FETCH_ASSOC);
        $temp['cant'] = $cantidad->fetchAll(PDO::FETCH_ASSOC);
        foreach ($temp['inicial'] as $rowindex => $row) {
            $result['data'][$rowindex]['idtransicion'] = $row['idtransicion'];
            $result['data'][$rowindex]['idinicial'] = $row['idestadoinicial'];
            $result['data'][$rowindex]['estinicial'] = $row['denominacion'];
            $result['data'][$rowindex]['idfinal']
                = $temp['final'][$rowindex]['idestadofinal'];
            $result['data'][$rowindex]['estfinal']
                = $temp['final'][$rowindex]['denominacion'];
        }
        $result['cant'] = $temp['cant'][0]['cant'];
        return $result;
    }

    public function GetIDTrans()
    {
        $query = new Doctrine_Query();
        $result = $query->select('max(t.idtransicion)')
            ->from('DatTransicion t')->execute();
        return $result->toArray();
    }

    public function ExisteTrans($idestadoi, $idestadof, $idtipodoc)
    {
        $q = Doctrine_Query::create()
            ->select('count(t.idtransicion)')
            ->from('DatTransicion t')
            ->where(
                't.idestadoinicial = ? AND t.idestadofinal = ? AND t.idtipodoc = ?',
                array($idestadoi, $idestadof, $idtipodoc)
            );
        $trans = $q->fetchArray();
        return $trans[0]['count'];
    }

    public function DameEstados($idtrans)
    {
        $query = new Doctrine_Query();
        $result = $query->select('*')
            ->from('DatTransicion t')
            ->where('t.idtransicion = ?', $idtrans)
            ->execute();
        return $result->toArray();
    }

    public function DameCantTrans($idestado)
    {
        $q = Doctrine_Query::create()
            ->select('count(t.idtransicion)')
            ->from('DatTransicion t')
            ->where(
                't.idestadoinicial = ? OR t.idestadofinal = ?',
                array($idestado, $idestado)
            );
        $trans = $q->fetchArray();
        return $trans[0]['count'];
    }

    public function NoExisteTransicionesConDoc($iddoc)
    {
        $query = Doctrine_Query::create();
        $query->select('count(t.idtipodoc)')
            ->from('DatTransicion t')
            ->where('t.idtipodoc = ?', $iddoc)
            ->execute();
        $doc = $query->fetchArray();
        return $doc[0]['count'] == 0;
    }

    public function TransicionId(
        $iddocumento, $idestadoinicial, $idestadofinal, $iduser
    ) 
    {
        $query = Doctrine_Query::create();
        $query->select('t.idtransicion')
            ->from('DatTransicion t')
            ->innerJoin('t.DatTransicionConfUsuario u')
            ->where(
                't.idtipodoc = ? AND t.idestadoinicial = ? 
                AND t.idestadofinal = ? AND u.idusuario = ?',
                array($iddocumento, $idestadoinicial, $idestadofinal, $iduser)
            );
        $doc = $query->fetchArray();
        return $doc;
    }

    public function TransicionId2(
        $iddocumento, $idestadoinicial, $idestadofinal, $iduser, $comp
    ) 
    {
        $query = Doctrine_Query::create();
        $query->select('t.idtransicion')
            ->from('DatTransicion t')
            ->innerJoin('t.DatTransicionConfUsuario u')
            ->where(
                "t.idestadoinicial =  $idestadoinicial 
                AND t.idestadofinal = $idestadofinal AND u.idusuario = $iduser "
                . $comp
            );
        $doc = $query->fetchArray();
        return $doc;
    }

    public function verificarAccesoTransicion(
        $idusuario, $idestadoinicial, $idestadofinal, $tipodoc
    ) 
    {
        $query = Doctrine_Query::create();
        $query->select('t.idtransicion')
            ->from('DatTransicion t')
            ->innerJoin('t.DatTransicionConfUsuario u')
            ->where(
                "t.idestadoinicial =  $idestadoinicial 
                AND t.idestadofinal = $idestadofinal AND u.idusuario = $idusuario "
                . $tipodoc
            );
        $doc = $query->fetchArray();        
        return $doc;
    }

    public function TransicionIdConf(
        $iddocumento, $idestadoinicial, $idestadofinal, $iduser, $comp
    ) 
    {
        $query = Doctrine_Query::create();
        $query->select('t.idtransicion')
            ->from('DatTransicion t')
            ->innerJoin('t.DatPostconacceso p')
            ->where("t.idestadofinal = $idestadoinicial " . $comp);
        $doc = $query->fetchArray();
        return $doc;
    }

    public function TransicionIdPost(
        $iddocumento, $idestadoinicial, $idestadofinal, $iduser, $comp
    ) 
    {
        $query = Doctrine_Query::create();
        $query->select('t.idtransicion')
            ->from('DatTransicion t')
            ->innerJoin('t.DatPostconacceso p')
            ->where(
                "t.idestadofinal = $idestadoinicial AND p.idusuario = $iduser "
                . $comp
            );
        $doc = $query->fetchArray();
        return $doc;
    }


    public function UsuariosSimultaneos($idtransicion)
    {
        $query = new Doctrine_Query();
        $result = $query->select('e.idusuario')
            ->from('ConfUsuario e')
            ->innerJoin('e.DatTransicionConfUsuario s')
            ->innerJoin('s.DatTransicion t')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->where(
                "t.idtransicion = ? AND s.simultaneo = ?",
                array($idtransicion, 1)
            );
        return $result->fetchArray();
    }

    public function ExisteEstadoEnTransicion($idestado, $idtipodoc)
    {
        $valor = 1;
        $tipodocplan = $tipodocobjetivo = $tipodocactividad = 0;
        if ($idtipodoc == 0) {
            $cadenacomp = " AND t.tipodocplan = ? ";
        }
        if ($idtipodoc == 1) {
            $cadenacomp = " AND t.tipodocobjetivo = ? ";
        }
        if ($idtipodoc == 3) {
            $cadenacomp = " AND t.tipodocactividad = ? ";
        }
        $q = Doctrine_Query::create()
            ->select('count(t.idtransicion)')
            ->from('DatTransicion t')
            ->where(
                "(t.idestadoinicial = ? OR t.idestadofinal = ?)" . $cadenacomp
                . " ", array($idestado, $idestado, $valor)
            );
        $trans = $q->fetchArray();
        return $trans[0]['count'];
    }

//--------------------------------------------------------------

    public function CargarTransiciones(
        $limit, $start, $idestadoinicial, $idestadofinal, $tipodocplan
        , $tipodocobjetivo, $tipodocactividad, $arrayautoresasoc,
        $arrayusuariosasoc
    )
    {
        $arrayautoresusuariosasoc = '';
        $joininvolaut = '';
        $cadenatipodoc = '';
        $cadena = " SELECT distinct(t.idtransicion),t.idestadoinicial,
            t.idestadofinal, t.idautor,t.tipodocplan AS plan,
            t.tipodocobjetivo AS objetivo, t.tipodocactividad AS actividad
            FROM mod_flujotrabajo.dat_transicion t ";
        //cadena sql con posibles autores  	
        if (isset($arrayautoresasoc[0])) {
            $totalaut = count($arrayautoresasoc);
            $operator = " OR ";
            $arrayautoresusuariosasoc .= " (";
            foreach ($arrayautoresasoc as $key => $autor) {
                $idautor = $autor['idautor'];
                if ($key == $totalaut - 1) {
                    $operator = " ";
                }
                $arrayautoresusuariosasoc .= " (t.idautor = '$idautor') "
                    . $operator;
            }
            if (isset($arrayusuariosasoc[0])) {
                $arrayautoresusuariosasoc .= " OR ";
            } else {
                $arrayautoresusuariosasoc .= " )";
            }
        }
        //cadena sql con posibles usuarios asociados  
        if (isset($arrayusuariosasoc[0])) {
            $cadena .= " LEFT JOIN mod_flujotrabajo.dat_transicion_conf_usuario 
                tu ON tu.idtransicion = t.idtransicion  ";
            $totalusuariosasociadosl = count($arrayusuariosasoc);
            $operator = " OR ";
            foreach ($arrayusuariosasoc as $key => $usuarioasociado) {
                $idusuario = $usuarioasociado['idusuario'];
                if ($key == $totalusuariosasociadosl - 1) {
                    $operator = " ";
                }
                $arrayautoresusuariosasoc .= " (tu.idusuario = '$idusuario') "
                    . $operator;
            }
            {
                $arrayautoresusuariosasoc .= " )";
            }
        }
        //cadena sql con los posibles tipos de docuemntos
        if ($tipodocplan || $tipodocobjetivo || $tipodocactividad) {
            $cadenatipodoc .= " AND ( ";
            if ($tipodocplan) {
                $cadenatipodoc .= " t.tipodocplan = 1 ";
                if ($tipodocobjetivo || $tipodocactividad) {
                    $cadenatipodoc .= " OR ";
                }
            }
            if ($tipodocobjetivo) {
                $cadenatipodoc .= " t.tipodocobjetivo = 1 ";
                if ($tipodocactividad) {
                    $cadenatipodoc .= " OR ";
                }
            }
            if ($tipodocactividad) {
                $cadenatipodoc .= " t.tipodocactividad = 1 ";
            }
            $cadenatipodoc .= " )";
        }
        $cadena .= " WHERE " . $arrayautoresusuariosasoc . $cadenatipodoc;
        if ($idestadoinicial != null) {
            $cadena .= " AND t.idestadoinicial = '$idestadoinicial' ";
        }
        if ($idestadofinal != null) {
            $cadena .= " AND t.idestadofinal = '$idestadofinal' ";
        }
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resultadosinpaginar = $res->fetchAll();
        $cadena .= " OFFSET(" . $start . ") LIMIT(" . $limit . ")";
        $result = $connA->execute($cadena);
        $resultadopaginado = $result->fetchAll();
        $resultadofinal['total'] = count($resultadosinpaginar);
        $resultadofinal['campos'] = $resultadopaginado;        
        return $resultadofinal;
    }

    public function EstadosSiguientesDadoEstadoBD($idestado)
    {
        $query = new Doctrine_Query();
        $result = $query->select('dt.idestadofinal')
            ->from('DatTransicion dt')
            ->where(
                "dt.idestadoinicial= $idestado AND dt.idestadofinal <> $idestado"
            );
        return $result->fetchArray();
    }

    public function EstadosAnterioresDadoEstadoBD($idestado, $arrayestados)
    {
        $query = new Doctrine_Query();
        $result = $query->select('dt.idestadoinicial')
            ->from('DatTransicion dt')
            ->where(
                "dt.idestadofinal= $idestado AND dt.idestadoinicial NOT IN ("
                . implode(",", $arrayestados) . ")"
            )
            ->execute();
        $result = $query->fetchArray();
        return $result;
    }
    

}
//fin clase



