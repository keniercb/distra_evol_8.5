<?php

/**
 * Clase dominio <b>Desgloses de Monedas</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain
 * @copyright  XETID
 * @version    1.0-0
 */
class DatDezglozemoneda extends BaseDatDezglozemoneda
{

    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasOne(
                'NomDezglozemonedas', array('local' => 'iddezglozemonedas',
            'foreign' => 'iddezglozemonedas')
        );
        $this->hasOne(
                'NomMoneda', array('local' => 'idmoneda', 'foreign' => 'idmoneda')
        );
        parent::setUp();
    }

    /**
     * Obtiene desgloses de monedas.
     *
     * @param mixed $agIdNomMoneda Identificador de nomenclador de moneda
     * @param mixed $agCategoria   Identificador de categoría
     *
     * @return array Desgloses
     */
    public function obtenerDesgloseMoneda($agIdNomMoneda, $agCategoria)
    {
        $query = Doctrine_Query::create();
        $result = $query->select(
                        "dd.iddezglozemoneda, nd.denominacion, nd.categoria, nd.valor"
                )
                ->from("DatDezglozemoneda dd")
                ->innerJoin("dd.NomDezglozemonedas nd")
                ->where(
                        "nd.categoria = ? and dd.idmoneda =?", array($agCategoria, $agIdNomMoneda)
                )
                ->orderby("nd.valor")
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    /**
     * Obtiene desgloses por identificador de moneda.
     *
     * @param array $cond    Condiciones
     * @param int   $agStart Inicio
     * @param int   $agLimit Límite
     *
     * @return mixed Desgloses
     * @throws Doctrine_Exception
     */
    static public function getDesglosesByIdNomMoneda(
    $cond = array(), $agStart = 0, $agLimit = 19
    )
    {
        try
        {
            $filter = " 0=0 ";
            if ($cond['idmoneda']) {
                $filter .= "and dd.idmoneda = '" . $cond['idmoneda'] . "'";
            }
            if ($cond['denominacion']) {
                $filter
                        .= " and nd.denominacion ilike '%" . $cond['denominacion']
                        . "%'";
            }
            if ($cond['sfFiltro']) {
                $filter .= "and (nd.denominacion ilike '%" . $cond['sfFiltro']
                        . "%' OR nd.valor::varchar ilike '%" . $cond['sfFiltro']
                        . "%')";
            }
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            //if ($filter) {
                $result = $conexionActual->fetchAll(
                        "SELECT dd.*,nd.*
                            FROM mod_datosmaestros.dat_dezglozemoneda dd
                            INNER JOIN mod_datosmaestros.nom_dezglozemoneda nd on
                            dd.iddezglozemonedas = nd.iddezglozemonedas
                            WHERE $filter
                            OFFSET $agStart
                            LIMIT $agLimit  ;"
                );
            if ($cond['sfFiltro']) {
                include_once Zend_Registry::get('config')->dir_aplication .
                    'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
                $result = UtilesDatosMaestros::colorSearch(
                    $result,
                    array('denominacion', 'valor'),
                    array($cond['sfFiltro'], $cond['sfFiltro'])
                );
            }

            /*} else {
                $result = $conexionActual->fetchAll(
                        "SELECT dd.*,nd.*
                            FROM mod_datosmaestros.dat_dezglozemoneda dd
                            INNER JOIN mod_datosmaestros.nom_dezglozemoneda nd on
                            dd.iddezglozemonedas = nd.iddezglozemonedas
                            OFFSET $agStart
                            LIMIT $agLimit  ;"
                );
            }*/
            return $result;
        }
        catch (Doctrine_Exception $exc)
        {
            throw $exc;
        }
    }

    /**
     * Obtiene desgloses por consulta SQL.
     *
     * @param array $cond Condiciones
     *
     * @return mixed Desgloses
     * @throws Doctrine_Exception
     */
    static public function getDesglosesByIdNomMonedaSQL($cond = array())
    {
        try
        {
            $filter = "";
            if ($cond['idmoneda']) {
                $filter .= "dd.idmoneda = '" . $cond['idmoneda'] . "'";
            }
            if ($cond['sfFiltro']) {
                $filter .= "and nd.denominacion ilike '%" . $cond['sfFiltro']
                        . "%' OR nd.valor::varchar ilike '%" . $cond['sfFiltro']
                        . "%'";
            }
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            if ($filter) {
                $result = $conexionActual->fetchAll(
                        "SELECT dd.*,nd.*
                            FROM mod_datosmaestros.dat_dezglozemoneda dd
                            INNER JOIN mod_datosmaestros.nom_dezglozemoneda nd on
                            dd.iddezglozemonedas = nd.iddezglozemonedas
                            WHERE $filter ;"
                );
            } else {
                $result = $conexionActual->fetchAll(
                        "SELECT dd.*,nd.*
                            FROM mod_datosmaestros.dat_dezglozemoneda dd
                            INNER JOIN mod_datosmaestros.nom_dezglozemoneda nd on
                            dd.iddezglozemonedas = nd.iddezglozemonedas ;"
                );
            }
            return $result;
        }
        catch (Doctrine_Exception $exc)
        {
            throw $exc;
        }
    }

    /**
     * Obtiene desgloses.
     *
     * @return mixed Desgloses
     * @throws Doctrine_Exception
     */
    static public function getDesgloses()
    {
        try
        {
            $query = Doctrine_Query::create();
            $result = $query
                    ->select("dd.*")
                    ->addSelect(
                            "nd.iddezglozemonedas as iddezglozemonedas, nd.denominacion as denominacion,
                     nd.valor as valor, nm.idmoneda, nm.nombremoneda"
                    )
                    ->addSelect(
                            "nm.idmoneda as idmoneda, nm.nombremoneda as nombremoneda"
                    )
                    ->from("DatDezglozemoneda dd")
                    ->innerJoin("dd.NomDezglozemonedas nd")
                    ->innerJoin("dd.NomMoneda nm")
                    ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                    ->execute();
            return $result;
        }
        catch (Doctrine_Exception $exc)
        {
            throw $exc;
        }
    }

    /**
     * Obtiene desgloses por rango.
     *
     * @param int $agStart Inicio
     * @param int $agLimit Límite
     *
     * @return mixed Desgloses
     * @throws Doctrine_Exception
     */
    static public function getDesglosesByRange($agStart = 0, $agLimit = 60)
    {
        try
        {
            $query = Doctrine_Query::create();
            $result = $query
                    ->select("dd.*")
                    ->addSelect(
                            "nd.iddezglozemonedas as iddezglozemonedas, nd.denominacion as denominacion,
                     nd.valor as valor, nm.idmoneda, nm.nombremoneda"
                    )
                    ->addSelect(
                            "nm.idmoneda as idmoneda, nm.nombremoneda as nombremoneda"
                    )
                    ->from("DatDezglozemoneda dd")
                    ->innerJoin("dd.NomDezglozemonedas nd")
                    ->innerJoin("dd.NomMoneda nm")
                    ->offset($agStart)
                    ->limit($agLimit)
                    ->orderBy("nd.denominacion, nd.valor")
                    ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                    ->execute();
            return $result;
        }
        catch (Doctrine_Exception $exc)
        {
            throw $exc;
        }
    }

    /**
     * Obtiene desgloses de monedas por categoría.
     *
     * @param mixed $agIdNomMoneda       Identificador de nomenclador de moneda
     * @param mixed $agCategoriaDesglose Categoría
     *
     * @return mixed Desgloses
     */
    static public function getDesglosesMonedaByCategoria(
    $agIdNomMoneda, $agCategoriaDesglose = 1
    )
    {
        /*$query = Doctrine_Query::create();
        $result = $query
                ->select("dd.*, nd.denominacion, nd.categoria, nd.valor")
                ->addSelect(
                        "nd.iddezglozemonedas as iddezglozemonedas, nd.denominacion as denominacion,
                 nd.valor as valor, nd.categoria as categoria"
                )
                ->addSelect(
                        "nm.idmoneda as idmoneda, nm.nombremoneda as nombremoneda"
                )
                ->from("DatDezglozemoneda dd")
                ->innerJoin("dd.NomDezglozemonedas nd")
                ->innerJoin("dd.NomMoneda nm")
                ->where(
                        "nd.categoria = ? and dd.idmoneda = ?", array($agCategoriaDesglose, $agIdNomMoneda)
                )
                ->orderBy("nd.valor, nd.denominacion")
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                ->execute();*/
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $arrayMonedaEntidad = $conexionActual->fetchAll(
            "SELECT *
                FROM mod_datosmaestros.dat_dezglozemoneda dd
                INNER JOIN mod_datosmaestros.nom_dezglozemoneda nd ON nd.iddezglozemonedas = dd.iddezglozemonedas
                INNER JOIN mod_datosmaestros.nom_moneda nm ON dd.idmoneda=nm.idmoneda
                WHERE dd.idmoneda =" . $agIdNomMoneda . " AND nd.categoria = ". $agCategoriaDesglose
        );
        return $arrayMonedaEntidad;
    }

}
