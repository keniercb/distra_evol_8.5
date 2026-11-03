<?php

/**
 * SegSession
 *
 * Entidad de dominio utilizada para salvar la session en una base de datos.
 *
 * @package    Quarseg
 * @subpackage Session
 * @author     Yoandry Morejon Borbon (ymorejonb@xetid.cu)
 * @version    1.0.0
 */
class SegSession extends ZendExt_Session_SaveHandler_Doctrine_Entity
{
    /**
     * @method cargarsesion($limit, $start) - Función usada para listar
     * las sesiones.
     * @param integer $limit - Limite.
     * @param integer $start - Comienzo.
     * @param array $params - Parametros.
     * @return Array.
     */
    static public function cargarsesion($start, $limit, $params)
    {
        $query = Doctrine_Query::create();
        $query->select(
            "a.idsession,
                      a.sessionid,
                      a.usuario,
                      a.ip,
                      a.fecha,
                      a.hora,
                      a.idrol,
                      a.idusuario,
                      identidad"
        )
            ->from('SegSession a')
            ->where("eliminar = false AND usuario != 'anonimo'")
            ->limit($limit)
            ->offset($start);
        if ($params->usuario != "") {
            $usuarios = str_replace(",", "','", $params->usuario);
            $query->addWhere("a.usuario IN ('{$usuarios}')");
        }
        if ($params->ip != "") {
            $ips = str_replace(",", "','", $params->ip);
            $query->addWhere("a.ip IN ('{$ips}')");
        }
        if ($params->fechainicio != "")
            $query->addWhere("a.fecha BETWEEN ? AND ?", array($params->fechainicio, $params->fechafin));

        $query->orderBy("a.fecha");
        return $query->fetchArray();
    }

    static public function total($params)
    {
        $query = Doctrine_Query::create();
        $query->select('COUNT(idsession) AS total')
            ->from('SegSession s')
            ->where('eliminar = false AND usuario != \'anonimo\'');
        if ($params->usuario != "") {
            $usuarios = str_replace(",", "','", $params->usuario);
            $query->addWhere("s.usuario IN ('{$usuarios}')");
        }
        if ($params->ip != "") {
            $ips = str_replace(",", "','", $params->ip);
            $query->addWhere("s.ip IN ('{$ips}')");
        }
        if ($params->fechainicio != "")
            $query->addWhere("s.fecha BETWEEN ? AND ?", array($params->fechainicio, $params->fechafin));

        return $query->fetchOne()->total;
    }

    public static function eliminarsesion($sessionIds)
    {
        try {
            $deleted = Doctrine_Query::create();
            $deleted->delete()
                ->from('SegSession')
                ->whereIn('idsession', $sessionIds)
                ->execute();
        } catch (Exception $e) {
            $message = array(
                'class' => 'SegSession',
                'pathToFile' => $e->getFile(),
                'type' => $e->getCode(),
                'message' => $e->getMessage()
            );
            print_r($message);
        }
    }

    /**
     * Obtiene la cantidad de sessiones abiertas de un usuario
     *
     * @param string $user - Nombre de usuario
     * @return SegSession - Cantidad de sessione abiertas
     */
    public static function getOpenedSessionByUser($user)
    {
        $_expired = new DateTime(
            '- ' . Zend_Session::getOptions('gc_maxlifetime') . ' seconds'
        );
        $_date = $_expired->format(
            ZendExt_GlobalConcept::getInstance()->Formato->fecha
        );
        $_time = $_expired->format(
            ZendExt_GlobalConcept::getInstance()->Formato->hora
        );
        $_ip = $_SERVER['REMOTE_ADDR'];
        $_sessionObj = Doctrine_Query::create()
            ->select("ip")
            ->from('SegSession')
            ->where(
                'usuario = ? AND (fecha >= ? OR (fecha = ? AND hora = ?)) '
                . 'AND ip <> ?',
                array($user, $_date, $_date, $_time, $_ip)
            )
            //->andWhere('eliminar = false')
            ->orderBy('fecha, hora')
            ->fetchArray();
        return $_sessionObj;
    }

    public static function deleteOpenedSessionByUser($user)
    {
        Doctrine_Query::create(
            Doctrine_Manager::getInstance()->getConnection('session')
        )
            ->delete()
            ->from('SegSession')
            ->where("usuario = ?", $user)
            ->execute();
    }

    static public function getUsers()
    {
        $query = Doctrine_Query::create();
        $query->select("DISTINCT(a.usuario) usuario")
            ->from('SegSession a')
            ->where("eliminar = false AND usuario != 'anonimo'")
            ->fetchArray();

        return $query->execute();
    }

    static public function getIps()
    {
        $query = Doctrine_Query::create();
        $query->select("DISTINCT(a.ip) ip")
            ->from('SegSession a')
            ->where("eliminar = false AND usuario != 'anonimo'")
            ->fetchArray();

        return $query->execute();
    }

    static public function CleanAnonymusSession()
    {
        $fecha = date('Y-m-d');
        $query = Doctrine_Query::create();
        $query->delete("SegSession a")
            ->where('a.usuario = \'anonimo\' AND a.fecha < \'' . $fecha . '\'');
        return $query->execute();
    }
}
