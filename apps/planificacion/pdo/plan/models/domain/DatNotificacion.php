<?php

class DatNotificacion extends BaseDatNotificacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatHistorial',
            array('local' => 'idhistorial', 'foreign' => 'idhistorial')
        );
    }

    /*public function GetLLave()
     {
           $query = new Doctrine_Query();
           $result = $query ->select('MAX('idnotificacion')')
           ->from('DatNotificacion')->execute();
           $arr = $result->toArray();
           return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);
     }*/

    public function Buscar($idnotificacion)
    {
        $temp = $this->conn->getTable('DatNotificacion')->find($idnotificacion);
        return $temp->toArray();
    }


    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatNotificacion')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 20, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatNotificacion')->limit($limite = 20)->offset(
            $inicio = 0
        )->execute();
        return $result->toArray();
    }

    public function cargarNotificaciones(
        $idusuario, $idusuariorelacionado, $asunto, $idaccion, $arraytipoelem,
        $fecha, $autores, $limit, $start, $noleidas
    )
    {
        $cadenatipoelemento = '';
        $cadenaautores = '';
        if (isset($autores[0])) {
            $cadenaautores .= ' AND ';
            $totalautores = count($autores);
            $operator = " OR ";
            foreach ($autores as $key => $autor) {
                $idautor = $autor->idautor;
                if ($key == $totalautores - 1) {
                    $operator = "";
                }
                $cadenaautores .= " (dh.idautor = '$idautor') " . $operator;
            }
        }
        if (isset($arraytipoelem[0])) {
            $cadenatipoelemento .= ' AND (';
            $totalelementos = count($arraytipoelem);
            $operator = " OR ";
            foreach ($arraytipoelem as $key => $tipoelemento) {
                $idtipo = $tipoelemento;
                if ($key == $totalelementos - 1) {
                    $operator = " )";
                }
                $cadenatipoelemento .= " dh.idtipoelemento = '$idtipo' "
                    . $operator;
            }
        }
        $conidusuariorelacionado = "";
        if ($idusuariorelacionado != null) {
            $conidusuariorelacionado
                = "dun.idusuariorelacionado = $idusuariorelacionado OR";
        }
        $cadena
            = "SELECT distinct(n.idnotificacion), dun.notificacionleida,
            n.idhistorial, n.descripcion AS asunto,n.descripcion, dh.idelemento, dh.idautor,
            dh.fecha, dh.idtipoelemento, dh.idaccion, na.denominacion AS denaccion,
            dh.fechainicio, dh.fechafin, dh.horainicio,dh.horafin, dh.hora
            FROM mod_objetivos.dat_notificacion n 
            INNER JOIN mod_objetivos.dat_historial dh 
            ON n.idhistorial = dh.idhistorial
            INNER JOIN mod_objetivos.dat_usuario_notificacion dun 
            ON n.idnotificacion = dun.idnotificacion
            INNER JOIN mod_objetivos.nom_accion na ON dh.idaccion = na.idaccion
            WHERE ($conidusuariorelacionado dun.idusuariorelacionado = $idusuario)"
            . $cadenatipoelemento . $cadenaautores;
        if ($idaccion != null) {
            $cadena .= " AND dh.idaccion = '$idaccion'  ";
        }
        if ($fecha != null) {
            $cadena .= " AND dh.fecha = '$fecha'  ";
        }
        if ($asunto != null) {
            $cadena .= " AND n.descripcion ILIKE '%$asunto%'  ";
        }
        if ($noleidas) {
            $cadena .= " AND dun.notificacionleida = 0";
        }
        if (empty($start)) {
            $start = 0;
        }
        if (empty($limit)) {
            $limit = 20;
        }
        //----
        $connA = Doctrine_Manager:: connection();
        $resnopag = $connA->execute($cadena);
        $resultnopag = $resnopag->fetchAll();
        $total = count($resultnopag);
        $cadena
            .= "GROUP BY dh.fecha , n.idnotificacion ,dun.notificacionleida,
            n.idhistorial ,n.descripcion ,dh.denelemento, dh.idelemento, dh.idautor, dh.fecha, 
            dh.idtipoelemento, dh.idaccion, na.denominacion,dh.fechainicio,
            dh.fechafin,dh.horainicio, dh.horafin, dh.hora ";
        $cadena
            .= "ORDER BY n.idnotificacion DESC OFFSET(" . $start . ") LIMIT("
            . $limit . ")";
        //print_r($cadena);die;
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        $resultado['total'] = $total;
        $resultado['datos'] = $result;
        return $resultado;
    }

    public function Insertar($obj)
    {
        $datNotificacion = new DatNotificacion();
        try {
            $datNotificacion->idhistorial = $obj->idhistorial;
            $datNotificacion->descripcion = $obj->descripcion;
            $datNotificacion->save();
            return $datNotificacion->idnotificacion;
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function eliminarNotificacionDB($idnotificacion)
    {
        try {
            $query = new Doctrine_Query();
            $query->delete("DatNotificacion")
                ->from("DatNotificacion dn")
                ->where("dn.idnotificacion = $idnotificacion")
                ->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerArrayIdNotificaciones($idusuariorelacionado, $idusuario)
    {
        $sql = " SELECT
                      du.idnotificacion
                    FROM
                      mod_objetivos.dat_usuario_notificacion du
                    WHERE
                      du.idusuariorelacionado = $idusuariorelacionado OR
                      du.idusuariorelacionado = $idusuario";


        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($sql);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

}//fin clase 

