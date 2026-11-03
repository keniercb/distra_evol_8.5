<?php

class DatEstado extends BaseDatEstado
{
    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'DatTransicion',
            array('local' => 'idestado', 'foreign' => 'idestadoinicial')
        );
        $this->HasMany(
            'DatTransicion',
            array('local' => 'idestado', 'foreign' => 'idestadofinal')
        );
        $this->HasMany(
            'ConfDocDatEstado',
            array('local' => 'idestado', 'foreign' => 'idestado')
        );
        $this->HasMany(
            'DatPostconacceso',
            array('local' => 'idestado', 'foreign' => 'idestado')
        );
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatEstado')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($start, $limit, $idtipodoc, $idautor)
    {
        $cadena = "SELECT distinct(e.idestado),e.denominacion ,de.inicial,
            de.notificacion, de.generacontrol, count(e.idestado) over() as total
            FROM mod_flujotrabajo.dat_estado e
            INNER JOIN mod_flujotrabajo.conf_doc_dat_estado de 
            ON de.idestado = e.idestado  
            WHERE e.idautor = '$idautor' AND  de.idtipodoc = '$idtipodoc'";
        $connA = Doctrine_Manager:: connection();

        if ($start == null) {
            $start = 0;
        }
        if ($limit == null) {
            $limit = 10;
        }
        $cadena .= " OFFSET(" . $start . ") LIMIT(" . $limit . ")";

        $result['datos'] = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        $result['total'] = $result['datos'][0]['total'];

        return $result;
    }

    public function getEstadoInicialPorAutor($idautor)
    {
        $cadena = " SELECT distinct(e.idestado),e.denominacion ,de.inicial,
                      de.notificacion, de.generacontrol
                      FROM mod_flujotrabajo.dat_estado e
                      INNER JOIN mod_flujotrabajo.conf_doc_dat_estado de 
                    ON de.idestado = e.idestado
            WHERE e.idautor = '$idautor' AND  de.idtipodoc = 3 AND de.notificacion = 1";
        $connA = Doctrine_Manager:: connection();
        $resnopag = $connA->execute($cadena);
        $resultnopag = $resnopag->fetchAll();
        $total = count($resultnopag);
        return  ($total>0) ? $resultnopag[0]['idestado']: 0;
    }
    
    public function GetControlDeEstado($idestado, $idtipodoc)
    {
        $cadena = "SELECT distinct(e.idestado),e.denominacion ,de.inicial,
            de.notificacion, de.generacontrol
            FROM mod_flujotrabajo.dat_estado e
            INNER JOIN mod_flujotrabajo.conf_doc_dat_estado de 
            ON de.idestado = e.idestado  
            WHERE e.idestado = '$idestado' AND  de.idtipodoc = '$idtipodoc'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }

    public function GetPorLimiteEstado($start, $limite, $idtipodoc, $idautor)
    {
        $subcadena = "SELECT e.idestado
            FROM mod_flujotrabajo.dat_estado e
            INNER JOIN mod_flujotrabajo.conf_doc_dat_estado de
            ON de.idestado = e.idestado  
            WHERE e.idautor = '$idautor' AND  de.idtipodoc = '$idtipodoc'";
        $cadena = "SELECT e.idestado,e.denominacion 
            FROM mod_flujotrabajo.dat_estado e
            WHERE e.idautor ='$idautor'
            AND e.idestado not in (" . $subcadena . ")";
        $connA = Doctrine_Manager:: connection();
        $resnopag = $connA->execute($cadena);
        $resultnopag = $resnopag->fetchAll();
        $total = count($resultnopag);
        if ($start == null) {
            $start = 0;
        }
        if ($limite == null) {
            $limite = 15;
        }
        if ($limite != null && $start != null) {
            $cadena .= " OFFSET(" . $start . ") LIMIT(" . $limite . ")";
            $res = $connA->execute($cadena);
            $result['total'] = $total;
            $result['datos'] = $res->fetchAll();
        }
        return $result;        
    }

    //Carga todos los estados asociados al documento para llenar los combos de la transicion
    public function CargarEstadosParaTransicion($idautor)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena = "SELECT distinct(e.idestado),e.denominacion 
            FROM mod_flujotrabajo.dat_estado e
            LEFT JOIN mod_flujotrabajo.dat_transicion t 
            ON t.idestadoinicial = e.idestado OR t.idestadofinal = e.idestado
            LEFT JOIN mod_flujotrabajo.conf_usuario_conf_doc_dat_estado ude 
            ON ude.idtransicion = t.idtransicion 
            WHERE e.idautor = '$idautor' OR  ude.idusuario = '$idautor'  ";
        $result = $connA->execute($cadena);
        $resultado = $result->fetchAll();
        return $resultado;        
    }

    public function EstadosVer($idusuario, $idtipodoc)
    {
        if ($idtipodoc == 0) {
            $comp = " AND tipodocplan = 1 ";
        }
        if ($idtipodoc == 1) {
            $comp = " AND tipodocobjetivo = 1 ";
        }
        if ($idtipodoc == 3) {
            $comp = " AND tipodocactividad = 1 ";
        }
        $cadena = " SELECT distinct(t.idestadoinicial),t.idestadoinicial AS idestado,
            e.denominacion
            FROM mod_flujotrabajo.dat_estado e 
            INNER JOIN mod_flujotrabajo.dat_transicion t 
            ON t.idestadoinicial = e.idestado
            LEFT JOIN mod_flujotrabajo.dat_transicion_conf_usuario tu 
            ON tu.idtransicion = t.idtransicion
            LEFT JOIN mod_flujotrabajo.conf_usuario_conf_doc_dat_estado ude 
            ON ude.idtransicion = t.idtransicion
            WHERE (e.idautor = '$idusuario' OR  tu.idusuario = '$idusuario') 
            AND (ude.tipo = 1 OR ude.tipo = 3) " . $comp;
//        print_r($cadena);die;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll();
        return $resultado;
    }

    public function EstadoPorDefecto($idusuario, $idtipodoc)
    {
        $cadena = "SELECT distinct(e.idestado),e.denominacion
            FROM mod_flujotrabajo.dat_estado e 
            INNER JOIN mod_flujotrabajo.conf_doc_dat_estado de 
            ON de.idestado = e.idestado						
            WHERE e.idautor = '$idusuario' AND (de.inicial = 1 
            AND de.idautor = '$idusuario' AND de.idtipodoc = '$idtipodoc') ";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll();
        return $resultado;
    }

    public function EstadosMod($idusuario, $idtipodoc, $idestadoinicial)
    {
        if ($idtipodoc == 0) {
            $comp = " AND tipodocplan = 1 ";
        }
        if ($idtipodoc == 1) {
            $comp = " AND tipodocobjetivo = 1 ";
        }
        if ($idtipodoc == 3) {
            $comp = " AND tipodocactividad = 1 ";
        }
        $cadena = "SELECT distinct(t.idestadofinal),t.idestadofinal AS idestado,
            e.denominacion
            FROM mod_flujotrabajo.dat_estado e 
            INNER JOIN mod_flujotrabajo.dat_transicion t 
            ON t.idestadofinal = e.idestado
            LEFT JOIN mod_flujotrabajo.dat_transicion_conf_usuario tu 
            ON tu.idtransicion = t.idtransicion
            LEFT JOIN mod_flujotrabajo.conf_usuario_conf_doc_dat_estado ude 
            ON ude.idtransicion = t.idtransicion
            WHERE (e.idautor = '$idusuario' OR  tu.idusuario = '$idusuario') 
            AND (ude.tipo = 2 OR ude.tipo = 3)
            AND t.idestadoinicial = '$idestadoinicial' " . $comp;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll();
        return $resultado;;
    }

    public function DenomEstado($idestado)
    {
        /*$query = new Doctrine_Query ();
               $result = $query->select('d.denominacion')
               ->from('DatEstado d')
               ->where("d.idestado = ?",$idestado)
               ->execute();
               return $result->toArray();*/
        $cadena = "SELECT d.denominacion
               FROM mod_flujotrabajo.dat_estado d
               WHERE (d.idestado = '$idestado')";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $resultado = $res->fetchAll(PDO::FETCH_ASSOC);
        return $resultado;
    }


    public function CargarEstados($denominacion, $idautor, $start, $limit)
    {
        $cadena = "SELECT distinct(e.idestado),e.denominacion ,e.idautor
            FROM mod_flujotrabajo.dat_estado e
            LEFT JOIN mod_flujotrabajo.dat_transicion t 
            ON t.idestadoinicial = e.idestado OR t.idestadofinal = e.idestado 
            LEFT JOIN mod_flujotrabajo.conf_usuario_conf_doc_dat_estado ude 
            ON ude.idtransicion = t.idtransicion
            WHERE (e.idautor = '$idautor' OR  ude.idusuario = '$idautor')";
        if ($denominacion != null) {
            $cadena .= " AND e.denominacion ILIKE '%$denominacion%'";
        }
        //print_r($cadena);die;
        $connA = Doctrine_Manager:: connection();
        $resnopag = $connA->execute($cadena);
        $resultnopag = $resnopag->fetchAll();
        $total = count($resultnopag);

        if ($start == null) {
            $start = 0;
        }
        if ($limit == null) {
            $limit = 10;
        }
        if ($limit != null && $start != null) {
            $cadena .= " OFFSET(" . $start . ") LIMIT(" . $limit . ")";
//            print_r($cadena);die;
            $res = $connA->execute($cadena);
            $result['total'] = $total;
            $result['datos'] = $res->fetchAll();
        }
        return $result;
    }
    public function actualizarElemSinEstadAprov($idaprob,$usuariocrea,$tipodoc){
        $cadena="UPDATE mod_objetivos.dat_elementos
        SET idestadoaprob =".$idaprob."
        WHERE idelemento in
        (select e.idelemento from mod_objetivos.dat_elementos e
        WHERE e.idusuariocrea =".$usuariocrea." and e.idestadoaprob
            is null and e.idtipoelemento=".$tipodoc.")";
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadena);
        $resultado = $resultadoParcial->fetchAll();
        return true;
    }
    
     public function GenerarEstadoPorDefecto($idusuariosession){
        //print_r($idusuariosession);die;
        $cadena = "  SELECT * FROM mod_flujotrabajo.f_crear_configuraciones_x_defecto ( " . $idusuariosession . " )";
        $connector = Doctrine_Manager:: connection();
        $resultadoParcial = $connector->execute($cadena);
        return 1;
    }


}//fin clase



