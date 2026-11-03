<?php

/**
 * @name DatServtransportacion - Clase del dominio para los servicios de transportacion.
 * @package   personaext
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class DatServtransportacion extends BaseDatServtransportacion
{
    /**
     * Constructor de la clase.
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomEstructransportacion', array('local' => 'idestructuratransportacion', 'foreign' => 'idestructuratransportacion'));
    }

    /**
     * @method obtenerPorId - Funcion que devuelve el objeto dado el identificador
     * @param $idservtransportacion - Identificador del servicio de transportacion
     *
     * @return Doctrine_Record
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerPorId($idservtransportacion)
    {
        return Doctrine::getTable('DatServtransportacion')->find($idservtransportacion);
    }

    /**
     * @method obtenerServTranspPorPersona - Funcion que devuelve los servicios de transportacion de una persona
     * @param $idpersona - Identificador de la persona
     *
     * @return Array - Arreglo con los datos de los servicios de transportacion
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerServTranspPorPersona($idpersona, $ruta)
    {
        //Construccion del DQL
        $query = Doctrine_Query::create()->select(
            "dst.*,estruct.denominacion as denomtransportacion,estruct.idpadre as idpadre,
            (CASE WHEN dst.fdesde <= now() and (dst.fhasta >= now() or dst.fhasta is null)
            THEN 0 ELSE 1 END) AS historico"
            )->from('DatServtransportacion dst')
            ->leftJoin('dst.NomEstructransportacion estruct')
            ->whereIn('dst.idpersona', $idpersona);

      /*  if ($unidad != '') {
            $query->andWhere(' dst.)');
        }*/

        //Ejecutando consulta y devolviendo el arreglo
        return $query->execute()->toArray();
    }
}