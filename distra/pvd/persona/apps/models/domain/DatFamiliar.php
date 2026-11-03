<?php

/**
 * @name DatFamiliar - Clase del dominio para la gestion de familiares de la persona.
 * @package   personaext
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class DatFamiliar extends BaseDatFamiliar
{
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomParentesco', array('local' => 'idparentesco', 'foreign' => 'idparentesco'));
        $this->hasOne('NomOrganizacion', array('local' => 'idorganizacion', 'foreign' => 'idorganizacion'));
    }

    /**
     * @method obtenerFamiliarPorPersona - Funcion que devuelve los datos de un familiar
     * @param $idfamiliar - Identificador del familiar
     * @return Array - Arreglo con los datos de los familiares
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerPorId($idfamiliar)
    {
        return Doctrine::getTable('DatFamiliar')->find($idfamiliar);
    }

    /**
     * @method obtenerFamiliarPorPersona - Funcion que devuelve los familiares de una persona
     * @param $idpersona - Identificador de la persona
     * @return Array - Arreglo con los datos de los familiares
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerFamiliarPorPersona($idpersona)
    {

        $query = Doctrine_Query::create()
            ->select('df.*, np.denominacion as parentesco')
            ->from('DatFamiliar df')
            ->innerJoin('df.NomParentesco np')
          //  ->innerJoin('df.NomOrganizacion org')
            ->whereIn('df.idpersona', $idpersona)
            ->orderBy('df.nombre');

        return $query->execute()->toArray();
    }

    public function obtenerFamiliarPorIdfamiliar($idfamiliar)
    {

        $query = Doctrine_Query::create()
            ->select('df.*, np.denominacion as parentesco')
            ->from('DatFamiliar df')
            ->innerJoin('df.NomParentesco np')
           // ->innerJoin('df.NomOrganizacion org')
            ->whereIn('df.idfamiliar', $idfamiliar);
        return $query->execute()->toArray();
    }
}