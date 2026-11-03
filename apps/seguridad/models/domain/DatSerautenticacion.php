<?php

/**
 * @name DatSerautenticacion - Clase dominio de servidores de autenticación.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatSerautenticacion extends BaseDatSerautenticacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatServidor', 
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasMany(
            'SegUsuarioDatSerautenticacion', 
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
    }

    /**
     * @author Darien García Tejo.
     * @method obtenercantidad($idservidor) - Verifica que el servidor de 
     * autenticación este en uso por un usuario.
     * @param integer $idservidor - Identificador del servidor.
     * @return integer
     */
    static public function obtenercantidad($idservidor)
    {
        $query = Doctrine_Query::create();
        $cant = $query->from('DatSerautenticacion s')
            ->innerjoin('s.SegUsuarioDatSerautenticacion us')
            ->where("us.idservidor = ?", $idservidor)->count();
        return $cant;
    }

    /**
     * @author Darien García Tejo.
     * @method cargarservidoresauth($limit, $start) - Retorna un listado 
     * de servidores.
     * @param integer $limit - Limite
     * @param integer $start - Inicio
     * @return DoctrineCollection
     */
    static public function cargarservidoresauth($limit, $start)
    {
        $q = Doctrine_Query::create();
        if (($limit != 0))
            $result = $q->select(
                's.idservidor id,s.idservidor, s.denominacion text,'
                . 's.tiposervidor, s.descripcion, s.ip'
            )
                ->from('DatServidor s ')
                ->orderby('idservidor')
                ->limit($limit)
                ->offset($start)
                ->execute();
        else
            $result = $q->select(
                's.idservidor id,s.idservidor, s.denominacion text'
            )
                ->from('DatServidor s')
                ->innerJoin('s.DatServidorbd b')
                ->orderby('s.idservidor')
                ->execute();
        return $result;
    }

    /**
     * @author Darien García Tejo.
     * @method tipoServidorAuth($idservidor) - Retorna los metadatos 
     * (tipo de servidor) del servidor de autenticación especificado.
     * @param integer $idservidor - Identificador del servidor.
     * @return Array
     */
    static public function tipoServidorAuth($idservidor)
    {
        $q = Doctrine_Query::create();
        $result = $q->select('s.tservidor')
            ->from('DatSerautenticacion s ')
            ->where('s.idservidor = ?', $idservidor)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * @author Darien García Tejo.
     * @method getAutenticationData($idservidor) - Retorna los metadatos 
     * del servidor de autenticación especificado.
     * @param integer $idservidor - Identificador del servidor.
     * @return Array
     */
    static function getAutenticationData($idservidor)
    {
        $query = Doctrine_Query::create();
        $resul = $query->select(
            's.idservidor,s.denominacion, s.ip, a.usuario, '
            . 'a.password, a.tservidor, a.puerto, a.ssl, a.tsl, a.basedn, a.usuario, a.password'
        )
            ->from('DatSerautenticacion a')
            ->innerjoin('a.DatServidor s')
            ->where("a.idservidor = ?", $idservidor)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $resul;
    }

    static public function listarservidoresauth()
    {
        return Doctrine_Query::create()->select(
            's.idservidor,s.denominacion, s.ip, a.usuario, '
            . 'a.password, a.tservidor, a.puerto, a.ssl, a.tsl, a.basedn, a.usuario, a.password'
        )
            ->from('DatSerautenticacion a')
            ->innerjoin('a.DatServidor s')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->fetchArray();
    }

}