<?php

/**
 * SegBloqueo
 *
 * Clase de acceso a dato a la entidad seg_bloqueo.
 *
 * @package    seguridad
 * @author     Equipo de seguridad UCID
 * @version    SVN: $Id: Builder.php 6820 2009-11-30 17:27:49Z jwage $
 */
class SegBloqueo extends BaseSegBloqueo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegBloqueousuario',
            array('local' => 'idbloqueo', 'foreign' => 'idbloqueo')
        );
        $this->hasOne(
            'SegBloqueoip', 
            array('local' => 'idbloqueo', 'foreign' => 'idbloqueo')
        );
    }

    /**
     * Funcion usada para eliminar usuario o direcciones ip bloqueadas.
     *
     * @param array $arrayDel
     * @return void
     */
    public static function eliminarUsuariosBloqueados($arrayDel)
    {
        Doctrine_Query::create()
            ->delete()
            ->from('SegBloqueo')
            ->whereIn('idbloqueo', $arrayDel)
            ->execute();
    }

    /**
     * Funcion usada para obtener todos los bloqueos.
     *
     * @param int $maxLifetime Tiempo de vida máximo del bloqueo.
     * @return array Listado de bloqueos.
     */
    public static function getAllLocks($maxLifetime)
    {
        if ($maxLifetime > 0)
            self::gc($maxLifetime);
        return Doctrine_Query::create()->select(
            'b.idbloqueo, b.fecha, b.hora, bu.usuario as usuario, bi.ip as ip'
        )
            ->from('SegBloqueo b')
            ->leftJoin('b.SegBloqueousuario bu ON (b.idbloqueo = bu.idbloqueo)')
            ->leftJoin('b.SegBloqueoip bi ON (b.idbloqueo = bi.idbloqueo)')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Garbage Collection - remove lock older
     * than $maxLifetime (in seconds)
     *
     * @param int $maxLifetime
     * @return bool
     */
    public static function gc($maxLifetime)
    {
        $expired = new DateTime('- ' . $maxLifetime . ' seconds');
        $date = $expired
            ->format(ZendExt_GlobalConcept::getInstance()->Formato->fecha);
        $time = $expired
            ->format(ZendExt_GlobalConcept::getInstance()->Formato->hora);
        Doctrine_Query::create()
            ->delete()
            ->from('SegBloqueo')
            ->where('fecha < ?', $date)
            ->orWhere('fecha = ? AND hora < ?', array($date, $time))
            ->execute();
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $conn->commit();
        $conn->beginTransaction();
    }

}