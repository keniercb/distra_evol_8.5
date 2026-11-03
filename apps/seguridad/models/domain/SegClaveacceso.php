<?php

/**
 * @name SegClaveacceso -Clase dominio de Claves.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class SegClaveacceso extends BaseSegClaveacceso
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegUsuario', 
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
    }

    /**
     * @author Darien García Tejo.
     * @method obtenerInfoClave($idusuario, $newpass) - Retorna la fecha de fin
     * de una clave dado el identificador del usuario y la contraseña (md5).
     * @param integer $idusuario - Identificador del usuario.
     * @param string $newpass - Contraseña en formato md5.
     * @return Array
     */
    static public function obtenerInfoClave($idusuario, $newpass)
    {
        $query = Doctrine_Query::create();
        return $query->select('fechafin')
            ->from('SegClaveacceso')
            ->where('idusuario = ? AND clave = ?', array($idusuario, $newpass))
            ->orderby('idclaveacceso')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * @author Darien García Tejo.
     * @method obtenerDatosUltClave($idusuario) - Retorna el identificador de 
     * la última clave.
     * @param integer $idusuario - Identificador del usuario.
     * @return integer - Identificador de la última clave.
     */
    static public function obtenerDatosUltClave($idusuario)
    {
        $query = Doctrine_Query::create();
        return $query->select(' max(idclaveacceso) idclaveacceso ')
            ->from('SegClaveacceso')
            ->where('idusuario = ?', $idusuario)
            ->execute();
    }

    /**
     * @author Darien García Tejo.
     * @method getActiveRestrictions() - Retorna la fecha de inicio, fin e 
     * identificador de las claves activas.
     * @return Array - Arreglo de claves activas.
     */
    static public function getActiveRestrictions()
    {
        $query = Doctrine_Query::create();
        return $query->select('fechainicio, fechafin, idclaveacceso')
            ->from('SegClaveacceso')
            ->where('valor = ?', true)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * @author Darien García Tejo.
     * @method updateKey($endDate, $pkidclaveacceso) - Actualiza la fecha de 
     * fin de la valides de clave
     * @param date $endDate - Fecha de fin de valides de la clave.
     * @param integer $pkidclaveacceso - Identificador de la clave.
     * @return void.
     */
    static public function updateKey($endDate, $pkidclaveacceso)
    {
        $query = Doctrine_Query::create();
        $query->update('SegClaveacceso')
            ->set('fechafin', '?', $endDate)
            ->where('idclaveacceso = ?', $pkidclaveacceso)
            ->execute();
    }

    /**
     * @author Darien García Tejo.
     * @method deleteRowsByIdUsuario($idusuario) - Elimina todos los records 
     * donde el identificador
     *                                             del usuario sea igual al 
     * pasado por parámetro.
     * @param integer $idusuario - Identificador del usuario.
     */
    static public function deleteRowsByIdUsuario($idusuario)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('SegClaveacceso')
            ->where('idusuario = ?', $idusuario)
            ->execute();
    }

    /**
     * @author Darien García Tejo.
     * @method obtenerClaveFechaFin($idusuario, $newpass) - Retorna la cantidad 
     * de veces que se a cambiado la contraseña a partir 
     * de la última vez que se usó.
     * @param integer $idusuario - Identificador del usuario.
     * @param string $newpass  - Contraseña en formato md5.
     * @return integer - Cantidad de veces que se a cambiado la contraseña.
     */
    static public function obtenerClaveFechaFin($idusuario, $newpass)
    {
        $query = Doctrine_Query::create();
        $record = $query->select('COUNT(ac.fechafin) as cantidad')
            ->from('SegClaveacceso ac')
            ->where(
                "ac.fechafin >= (SELECT max(c.fechafin) FROM SegClaveacceso c "
                . "WHERE c.idusuario = ? AND c.clave = ?) AND ac.idusuario = ?",
                array($idusuario, $newpass, $idusuario)
            )->execute();
        return $record[0]->cantidad;
    }

    /**
     * @method obtenerHistoricoClaves($idusuario) - Retorna el historico de claves para un usuario
     * @param integer $idusuario - Identificador del usuario.
     * @return array - Historico de claves.
     */
    static public function obtenerHistoricoClaves($idusuario)
    {
        $query = Doctrine_Query::create();
        $record = $query->select('*')
            ->from('SegClaveacceso ac')
            ->where(
                "ac.idusuario = ?",
                array($idusuario)
            )
            ->orderby('ac.idclaveacceso')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();

        return $record;
    }

    /**
     * @method eliminarClaveMasAntigua($idclaveacceso) - Elimina el registro de la(s) clave(s) mas antigua(s) en el historial
     * @param integer $idclaveacceso - Identificador de la clave de acceso.
     */
    static public function eliminarClaveMasAntigua($idclaveacceso)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('SegClaveacceso ac');
        if (!is_array($idclaveacceso)) {
            $query->where('ac.idclaveacceso = ?', $idclaveacceso);
        } else {
            $query->whereIn("ac.idclaveacceso", $idclaveacceso);
        }

        $query->execute();
    }

    /**
     * @method eliminarClaveById($idclaveacceso) - Elimina clave de acceso del historial
     * @param integer $idclaveacceso - Identificador de la clave de acceso.
     */
    static public function eliminarClaveById($idclaveacceso)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('SegClaveacceso ac')
            ->where('ac.idclaveacceso = ?', $idclaveacceso)
            ->execute();
    }

}
