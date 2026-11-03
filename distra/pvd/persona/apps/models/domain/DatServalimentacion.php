<?php

/**
 * @name DatServalimentacion - Clase del dominio para los servicios de alimentacion.
 * @package   personaext
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class DatServalimentacion extends BaseDatServalimentacion
{
    /**
     * Constructor de la clase.
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomEventoalimentacion', array('local' => 'idevento', 'foreign' => 'idevento'));
        $this->hasOne('NomEstalimentacion', array('local' => 'idestalimentacion', 'foreign' => 'idestalimentacion'));
    }

    /**
     * @method obtenerPorId - Funcion que devuelve el objeto dado el identificador
     * @param $idservalimentacion - Identificador del servicio de alimentacion
     *
     * @return Doctrine_Record
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerPorId($idservalimentacion)
    {
        return Doctrine::getTable('DatServalimentacion')->find($idservalimentacion);
    }

    /**
     * @method obtenerServAlimentacionPorPersona - Devuelve los servicios de alimetacion de la persona.
     * @params $idpersona - Identificador de la persona.
     * @return Array - Arreglo con los servicios de alimentacion de la persona.
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerServAlimentacionPorPersona($idpersona, $evento, $pantry)
    {
//print_r(array($evento,$pantry));die;

        $sql = "SELECT dsa.*,nesta.denominacion as denomalimentacion,
                nea.denominacion as evento,
                (CASE WHEN dsa.fdesde <= now() and (dsa.fhasta >= now() or dsa.fhasta is null)
                  THEN 0 ELSE 1 END) AS historico
                FROM mod_personaext.dat_servalimentacion dsa
                INNER JOIN mod_personaext.nom_eventoalimentacion nea ON (dsa.idevento = nea.idevento)
                INNER JOIN mod_personaext.nom_estalimentacion nesta ON (dsa.idestalimentacion = nesta.idestalimentacion)
                WHERE dsa.idpersona = $idpersona";

        if (!empty($pantry)) {
            $query .= " AND dsa.idestalimentacion=$pantry  ";
        }
        if (!empty($evento)) {
            $query .= " AND dsa.idevento=$evento";
        }


        $sqlfilters = "SELECT dsa.*,nesta.denominacion as denomalimentacion,
                nea.denominacion as evento,
                (CASE WHEN dsa.fdesde <= now() and (dsa.fhasta >= now() or dsa.fhasta is null)
                  THEN 0 ELSE 1 END) AS historico
                FROM mod_personaext.dat_servalimentacion dsa
                INNER JOIN mod_personaext.nom_eventoalimentacion nea ON (dsa.idevento = nea.idevento)
                INNER JOIN mod_personaext.nom_estalimentacion nesta ON (dsa.idestalimentacion = nesta.idestalimentacion)
                WHERE dsa.idpersona = $idpersona " . $query;

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        if ($evento != '' || $pantry != '') {
            $r = $conn->fetchAll($sqlfilters);
        } else {
            $r = $conn->fetchAll($sql);
        }
        //print_r($r);die;
        return $r;
    }

    public function getEntidad($idestructura)
    {
       //  print_r($idestructura);die;
        $sql = "SELECT  idestructura
                 FROM mod_fuerzatrabajo.conf_entidad
                 where mod_fuerzatrabajo.conf_entidad.identidad=$idestructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        // print_r($sql);die;

        return $conn->fetchAll($sql);
    }


}