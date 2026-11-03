<?php

/**
 * @name DatServalojamiento - Clase del dominio para los servicios de alojamiento.
 * @package   personaext
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class DatServalojamiento extends BaseDatServalojamiento
{
    /**
     * Constructor de la clase.
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('Nomestructalojamiento', array('local' => 'idestructuraalojamiento', 'foreign' => 'idestructuraalojamiento'));
    }

    /**
     * @method obtenerPorId - Funcion que devuelve el objeto dado el identificador
     * @param $idservtransportacion - Identificador del servicio de alojamiento
     *
     * @return Doctrine_Record
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerPorId($idservalojamiento)
    {
        return Doctrine::getTable('DatServalojamiento')->find($idservalojamiento);
    }

    /**
     * @method obtenerServAlojPorPersona - Funcion que devuelve los servicios de alojamiento de una persona
     * @param $idpersona - Identificador de la persona
     *
     * @return Array - Arreglo con los datos de los servicios de alojamiento
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerServAlojPorPersona($idpersona)
    {
       // print_r($idpersona);die;
        //Construccion del DQL
        $query = Doctrine_Query::create()->select(
            "dst.*,estruct.denominacion as denomalojamiento,estruct.idpadre as idpadre, (CASE WHEN dst.fdesde <= now() and (dst.fhasta >= now() or dst.fhasta is null)
            THEN 0 ELSE 1 END) AS historico"
        )->from('DatServalojamiento dst')
            ->leftJoin('dst.Nomestructalojamiento estruct')->whereIn('dst.idpersona', $idpersona);

        //Ejecutando consulta y devolviendo el arreglo
        return $query->execute()->toArray();
    }

}