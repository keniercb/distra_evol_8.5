<?php

/**
 * Description of NomConcept
 *
 * @author     Alucard
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomConcept extends BaseNomConcept
{
    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'NomTiponivelestructural', array(
                                            'local' => 'idconceptoestructural', 'foreign' => 'idconceptoestructural'
                                       )
        );
        $this->HasMany(
            'NomNivelestructural', array(
                                        'local' => 'idconceptoestructural', 'foreign' => 'idconceptoestructural'
                                   )
        );
        $this->HasMany(
            'NomFilaestruceav', array(
                                     'local' => 'idconceptoestructural', 'foreign' => 'idnomeav'
                                )
        );
        $this->HasMany(
            'NomCamponiveleav', array(
                                     'local' => 'idconceptoestructural', 'foreign' => 'idconceptoestructural'
                                )
        );
    }

    /**
     * Función que se utiliza para devolver la cantidad de elementos
     *
     * @param mixed $filtrodenominacion Filtro denominación
     * @param int   $filtrofechaini     Filtro fecha inicio
     * @param int   $filtrofechafin     Filtro fecha fin
     *
     * @return integer
     * @throws Doctrine_Exception
     */
    static function cantidad($filtrodenominacion, $filtrofechaini, $filtrofechafin)
    {
        try {
            $query = Doctrine_Query::create();
            $datos = $query->from('NomConcept')->where("visible = ?", 1);
            $datos = ($filtrodenominacion != '') ? $datos->addWhere(
                "lower(denominacion) LIKE '$filtrodenominacion%'"
            )
                : $datos;
            if (($filtrofechaini != '') && ($filtrofechafin != '')) {
                $datos = $datos->addWhere(
                    "fechaini >= '$filtrofechaini' AND fechafin <='$filtrofechafin'"
                );
            } else {
                $datos = ($filtrofechaini != '') ? $datos->addWhere(
                    "fechaini='$filtrofechaini'"
                )
                    : $datos;
                $datos = ($filtrofechafin != '') ? $datos->addWhere(
                    "fechafin='$filtrofechafin'"
                )
                    : $datos;
            }
            $final = $datos->count();
            return $final;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Función que se utiliza para devolver los datos pasando el start y el limit
     *
     * @param int   $limit              -límite de valores para realizar la consulta
     * @param int   $start              -comienzo para buscar los valores
     * @param mixed $filtrodenominacion Filtro denominación
     * @param int   $filtrofechaini     Filtro fecha inicio
     * @param int   $filtrofechafin     Filtro fecha fin
     *
     * @return Object
     * @throws Doctrine_Exception
     */
    static function valores($limit, $start, $filtrodenominacion, $filtrofechaini, $filtrofechafin)
    {
        try {
            $query = Doctrine_Query::create();
            $datos = $query->select('*')->from('NomConcept')->limit($limit)->offset($start)->where("visible = ?", 1);
            $datos = ($filtrodenominacion != '') ? $datos->addWhere(
                "lower(denominacion) LIKE '$filtrodenominacion%'"
            )
                : $datos;
            if (($filtrofechaini != '') && ($filtrofechafin != '')) {
                $datos = $datos->addWhere("fechaini >= '$filtrofechaini' AND fechafin <='$filtrofechafin'");
            } else {
                $datos = ($filtrofechaini != '') ? $datos->addWhere("fechaini='$filtrofechaini'") : $datos;
                $datos = ($filtrofechafin != '') ? $datos->addWhere("fechafin='$filtrofechafin'") : $datos;
            }

            $final = $datos->execute()->toArray();
            return $final;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    static public function comprobar($idconceptoestructural)
    {
        $query = Doctrine_Query::create();
        return $query->select('*')
            ->from('NomConcept')->where("idconceptoestructural=$idconceptoestructural")->execute()->toArray();
    }

    /**
     * Función que se utiliza para devolver los campos asociados a un concepto
     *
     * @param int  $idconceptoestructural -id del concepto
     * @param bool $mostrarOcultos
     *
     * @return array
     */
    static function obtenerDatosadicionales($idconceptoestructural, $mostrarOcultos = false)
    {
        $sqlTabla = $idconceptoestructural ? " AND t.idconceptoestructural = '$idconceptoestructural'" : '';
        $sqlVisi = $mostrarOcultos ? "  " : "  AND c.visible = '1'  ";
        $q = Doctrine_Query::create();
        $result = $q->select('t.*,c.*')
            ->from('NomConcept t')
            ->innerJoin('t.NomCamponiveleav c')->where(
                't.idconceptoestructural = c.idconceptoestructural ' . $sqlTabla . $sqlVisi
            )->orderBy(' c.orden ')->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    /**
     * Función que se utiliza para devolver los campos asociados a un concepto
     *
     * @param uri $uri -uri del conceto estructural y para el caso en que se crea el servicio
     * es la denominación del País
     *
     * @author Liv\xE1n Capote Valdés
     * @return array
     */
    static public function comprobarPorUri($uri)
    {
        $query = Doctrine_Query::create();
        $fechahoy = date("d/m/Y");
        $datos = $query->select("*")
            ->from('NomConcept')
            ->where("fechafin is NULL OR fechafin >= '$fechahoy' OR fechaini >= '$fechahoy'")
            ->addwhere("uri='$uri'")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function obtenerIdFuncionalidadGestionarRelaciones()
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();

        return $conexionActual->fetchAll(
            "SELECT idfuncionalidad
                FROM mod_seguridad.dat_recurso
                WHERE abreviatura = 'btnAdicionarEav300000003969' OR abreviatura = 'btnModificarEav300000003969' OR
                      abreviatura = 'btnEliminarEav300000003969' OR abreviatura = 'btnEliminarRe300000003969' OR
                      abreviatura = 'btnGestionarRelaciones300000003969' OR abreviatura = 'btnAdicionarRe300000003969';"
        );
    }

}