<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatServidor extends BaseDatServidor
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatSistemaDatServidores',
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasOne(
            'DatSerautenticacion',
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasOne(
            'DatServidorbd',
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasOne(
            'DatServidoremail',
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasOne(
            'DatServidorxmpp',
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
    }

    /**
     * Funcion usada para retornar un listado de los servidores
     * de base de datos.
     *
     * @return array Listado de servidores de base de datos.
     */
    static public function cargarservidores()
    {
        return Doctrine_Query::create()->select(
            's.idservidor id, s.denominacion text'
        )
            ->from('DatServidor s')
            ->where("s.tiposervidor=?", 'bd')
            ->orderby('s.idservidor')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Funcion usada para listar todos los servidores
     * (de datos y autenticacion) por lotes.
     *
     * @param integer $limit Limite a paginar
     * @param integer $start Comienzo del paginado
     * @return array Listado de todos los servidores.
     */
    static public function cargarListadoServidores($limit, $start)
    {
        return Doctrine_Query::create()->select(
            " s.idservidor, s.idservidor as id, s.denominacion as text,"
            . " s.tiposervidor as tiposervidor, s.descripcion as descripcion, s.ip as ip,"
            . " a.tservidor as tservidor, a.basedn as basedn, a.objectclass as objectclass, a.fnombre as fnombre, a.fapellidos as fapellidos, a.fusuario as fusuario,"
            . " (CASE WHEN s.tiposervidor = \$a\$autenticaci&oacute;n\$a\$ THEN a.usuario ELSE CASE WHEN s.tiposervidor = \$\$email\$\$ THEN e.usuario ELSE x.usuario END END) as usuario, "
            . " (CASE WHEN s.tiposervidor = \$a\$autenticaci&oacute;n\$a\$ THEN a.puerto ELSE CASE WHEN s.tiposervidor = \$\$email\$\$ THEN e.puerto ELSE x.puerto END END) as puerto, "
            . " (CASE WHEN s.tiposervidor = \$b\$autenticaci&oacute;n\$b\$ THEN a.tsl ELSE CASE WHEN s.tiposervidor = \$\$email\$\$ THEN e.tsl ELSE x.tsl END END) as \"tsl\", "
            . " (CASE WHEN s.tiposervidor = \$c\$autenticaci&oacute;n\$c\$ THEN a.ssl ELSE CASE WHEN s.tiposervidor = \$\$email\$\$ THEN e.ssl ELSE x.ssl END END) as \"ssl\", "
            . " (CASE WHEN s.tiposervidor = \$d\$autenticaci&oacute;n\$d\$ THEN '' ELSE CASE WHEN s.tiposervidor = \$\$email\$\$ THEN e.fqdn ELSE x.fqdn END END) as fqdn "

        )
            ->from("DatServidor s")
            ->leftJoin("s.DatSerautenticacion a")
            ->leftJoin("s.DatServidoremail e")
            ->leftJoin("s.DatServidorxmpp x")
            ->orderby("s.idservidor")
            ->limit($limit)
            ->offset($start)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Funcion usada para obtener los datos del servidor pasado por parametro.
     *
     * @param integer $idservidor Identificador del servidor.
     * @return Doctrine_Collection
     */
    static public function gettiposerv($idservidor)
    {
        return Doctrine_Query::create()->select('s.tiposervidor')
            ->from('DatServidor s')
            ->where("s.idservidor=?", $idservidor)
            ->execute();
    }

    /**
     * Funcion usada para obtener la cantidad total de servidores registrados.
     *
     * @return integer Cantidad de servidores.
     */
    static public function obtenercantserv()
    {
        return Doctrine_Query::create()->select('COUNT(s.idservidor) AS cant')
            ->from('DatServidor s')
            ->fetchOne()->cant;
    }

    /**
     * Funcion usada para obtener el listado de servidores de autenticacion (
     * el listado esta compuesto solamente por los metadatos idservidor
     * y denominacion)
     *
     * @return array Listado de servidores de autenticacion.
     */
    static function cargarcomboservidoresaut()
    {
        $tiposervidor = 'autenticaci&oacute;n';
        return Doctrine_Query::create()->select('s.idservidor,s.denominacion')
            ->from('DatServidor s')
            ->innerjoin(
                's.DatSerautenticacion a ON s.idservidor = a.idservidor'
            )
            ->where("s.tiposervidor = ?", $tiposervidor)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Funcion usada para obtener la cantidad de servidores con
     * la misma denominacion.
     *
     * @param string $denominacion Denominacion del servidor.
     * @return integer Cantidad de servidores con la misma denominacion.
     */
    static public function comprobardatosservidor($denominacion)
    {
        return Doctrine_Query::create()->select('COUNT(idservidor) as cant')
            ->from('DatServidor')
            ->where("denominacion = ? ", $denominacion)
            ->fetchOne()->cant;
    }

    /**
     * Funcion usada para obtener los datos del servidor con
     * la misma denominacion.
     *
     * @param string $denominacion Denominacion del servidor.
     * @return array Datos del servidor.
     */
    static public function cargardatosservidor($denominacion)
    {
        return Doctrine_Query::create()->select(
            's.*, a.*, e.*, x.*'
        )
            ->from('DatServidor s')
            ->where("denominacion = ?", $denominacion)
            ->leftJoin('s.DatSerautenticacion a')
            ->leftJoin('s.DatServidoremail e')
            ->leftJoin('s.DatServidorxmpp x')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Funcion ausada para obtener los datos del servidor de
     * autenticacion solicitado.
     *
     * @param integer $idservidor Identificador del servidor.
     * @return Doctrine_Collection
     */
    static function usuarioservidoraut($idservidor)
    {
        return Doctrine_Query::create()->select(
            's.idservidor,s.denominacion, a.usuario, '
            . 'a.password, a.tservidor, a.basedn'
        )
            ->from('DatServidor s')
            ->innerjoin('s.DatSerautenticacion a')
            ->where("s.idservidor = ?", $idservidor)
            ->execute();
    }

    /**
     * Funcion usada para obtener el listado de los servidores de autenticacion
     * que estan asociados al usuario seleccionado.
     *
     * @param integer $idusuario Identificador del usuario.
     * @return array Listado de servidores.
     */
    static function getServidorAuth($idusuario)
    {
        return Doctrine_Query::create()->select(
            's.idservidor,s.denominacion, s.ip, a.usuario, '
            . 'a.password, a.tservidor, a.basedn, ua.idservidor,'
            . ' a.usuario, a.password, a.puerto'
        )
            ->from('DatServidor s')
            ->innerjoin('s.DatSerautenticacion a')
            ->innerjoin('a.SegUsuarioDatSerautenticacion ua')
            ->where("ua.idusuario = ?", $idusuario)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Funcion usada para eliminar servidores.
     *
     * @param array $arrayServ Listado de identificadores de servidores
     */
    static function elimirarServidores($arrayServ)
    {
        Doctrine_Query::create()->delete()
            ->from('DatServidor')
            ->whereIn("idservidor", $arrayServ)
            ->execute();
    }


}