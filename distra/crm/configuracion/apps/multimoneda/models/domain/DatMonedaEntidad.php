<?php

/**
 * Clase dominio <b>Moneda-Entidad</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain
 * @copyright  XETID
 * @version    1.0-0
 */
class DatMonedaEntidad extends BaseDatMonedaEntidad
{

    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomMoneda', array('local' => 'idmoneda', 'foreign' => 'idmoneda')
        );
    }

    /**
     * Obtiene una moneda-entidad a partir de su identificador.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     *
     * @return array Moneda-Entidad
     */
    public function getMonedaEntidadById($idmonedaentidad)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatMonedaEntidad me')
            ->innerJoin('me.NomMoneda nm')
            ->where(
                "me.idmonedaentidad = ?", array($idmonedaentidad)
            )->execute();
        return $result->toArray();
    }

    /**
     * Obtiene monedas por entidad.
     *
     * @return array Monedas
     */
    public function getMonedasByEntidad()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatMonedaEntidad')->execute();
        return $result->toArray();
    }

    /**
     * Obtiene moneda-entidad por rango.
     *
     * @param int $limite Límite
     * @param int $inicio Inicio
     *
     * @return array Moneda-Entidad
     */
    public function GetMonedaEntidadByRange($limite = 19, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatMonedaEntidad')->limit($limite = 19)->offset(
            $inicio = 0
        )->execute();
        return $result->toArray();
    }

    /**
     * Obtiene moneda-entidad a partir de los identificadores de moneda y entidad.
     *
     * @param mixed $idmoneda  Identificador de moneda
     * @param mixed $identidad Identificador de entidad
     *
     * @return mixed Moneda-Entidad
     */
    public static function buscarIdMonedaEntidad($idmoneda, $identidad)
    {
        $query = Doctrine_Query::create();
        $result = $query->from("DatMonedaEntidad dn")
            ->where("dn.idmoneda = ? and dn.idestructuracomun = ?", array($idmoneda, $identidad))
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * Obtiene moneda-entidad a partir de su identificador.
     *
     * @param mixed $idmonedaentidad Identificador de moneda-entidad
     *
     * @return mixed Moneda-Entidad
     */
    static public function getMonedaEntidadByIdMonedaEntidad($idmonedaentidad)
    {
        /*$query = new Doctrine_Query();
        $arrayMonedaEntidad = $query
                ->select("dn.*,nm.*")
                ->from("DatMonedaEntidad dn")
                ->innerJoin("dn.NomMoneda nm")
                ->where("dn.idnommonedaentidad = ?", $idmonedaentidad)
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                ->execute();*/
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $arrayMonedaEntidad = $conexionActual->fetchAll(
            "SELECT dm.*, nm.*
                FROM mod_datosmaestros.dat_monedaentidad dm
                INNER JOIN mod_datosmaestros.nom_moneda nm ON nm.idmoneda = dm.idmoneda
                WHERE dm.idmonedaentidad = " . $idmonedaentidad
        );
        return $arrayMonedaEntidad;
    }

    /**
     * Obtiene monedas a partir de par\xE1metros de una entidad.
     *
     * @param array $cond Condiciones o par\xE1metros
     *
     * @return array Monedas
     */
    public function obtenerMonedasByEntidad($cond = array())
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $filter = "";
        if ($cond['idmonedaentidad']) {
            $filter .= "me.idmonedaentidad= '" . $cond['idmonedaentidad']
                . "'";
        }
        if ($cond['idestructuracomun'] && $filter != '') {
            $filter
                .= " and me.idestructuracomun = '" . $cond['idestructuracomun']
                . "'";
        } elseif ($cond['idestructuracomun']) {
            $filter .= "me.idestructuracomun = '" . $cond['idestructuracomun']
                . "'";
        }
        if ($filter) {
            $result = $conexionActual->fetchAll(
                "SELECT me.idmonedaentidad, me.tipomoneda, me.idestructuracomun,
                nm.idmoneda,nm.codigo, nm.codigoiso, nm.nombremoneda,
                 CASE WHEN nm.idpais ISNULL THEN nm.organizacion ELSE p.nombrepais END as organizacion,
                nm.simbolo, nm.presicion, nm.factorredondeo
						FROM mod_datosmaestros.dat_monedaentidad me 
						LEFT JOIN mod_datosmaestros.nom_moneda nm on me.idmoneda = nm.idmoneda
						LEFT JOIN mod_datosmaestros.nom_pais p ON nm.idpais = p.idpais
                                                WHERE $filter
						ORDER BY nm.codigo ASC;"
            );
        } else {
            $result = $conexionActual->fetchAll(
                "SELECT me.idmonedaentidad, me.tipomoneda, me.idestructuracomun,
                nm.idmoneda,nm.codigo, nm.codigoiso, nm.nombremoneda,
                CASE WHEN nm.idpais ISNULL THEN nm.organizacion ELSE p.nombrepais END as organizacion,
                nm.simbolo, nm.presicion, nm.factorredondeo
						FROM mod_datosmaestros.dat_monedaentidad me 
						LEFT JOIN mod_datosmaestros.nom_moneda nm on me.idmoneda = nm.idmoneda
						LEFT JOIN mod_datosmaestros.nom_pais p ON nm.idpais = p.idpais
						ORDER BY nm.codigo ASC;"
            );
        }
        return array('datos' => $result);
    }

    /**
     * Obtiene monedas contables a partir de una entidad.
     *
     * @param mixed $estructura Identificador de estructura común.
     * @param mixed $dualidad   Se incluye en el resultado las monedas con dualidad 1 en caso de tener valor 1
     *                          este parametro.
     *
     * @return array Monedas
     * @throws Doctrine_Exception
     */
    static function ObtenerMonedaContableDadoEntidad($estructura, $dualidad = 1)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $dualidad = $dualidad == 1 ? ' OR me.dualidad = 1' : '';
            $result = $conexionActual->fetchAll(
                "SELECT me.idmonedaentidad, me.tipomoneda, me.idestructuracomun, me.dualidad,
                nm.idmoneda,nm.codigo, nm.codigoiso, nm.nombremoneda,
                CASE WHEN nm.idpais ISNULL THEN nm.organizacion ELSE p.nombrepais END as organizacion,
                nm.simbolo, nm.presicion, nm.factorredondeo
				FROM mod_datosmaestros.dat_monedaentidad me
				LEFT JOIN mod_datosmaestros.nom_moneda nm on me.idmoneda = nm.idmoneda
				LEFT JOIN mod_datosmaestros.nom_pais p ON nm.idpais = p.idpais
                WHERE me.idestructuracomun='$estructura' AND (me.tipomoneda = 0$dualidad)
				ORDER BY nm.codigo ASC;"
            );
            return array('datos' => $result);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Obtiene monedas alternativas a partir de una entidad.
     *
     * @param mixed $estructura Identificador de estructura común
     *
     * @return array Monedas
     * @throws Doctrine_Exception
     */
    static function ObtenerMonedasAlternativasDadoEntidad($estructura)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $result = $conexionActual->fetchAll(
                "SELECT me.idmonedaentidad, me.tipomoneda, me.idestructuracomun, nm.idmoneda,nm.codigo,
                nm.codigoiso, nm.nombremoneda,me.dualidad,
                 CASE WHEN nm.idpais ISNULL THEN nm.organizacion ELSE p.nombrepais END as organizacion,
                 nm.simbolo, nm.presicion, nm.factorredondeo
						FROM mod_datosmaestros.dat_monedaentidad me 
						LEFT JOIN mod_datosmaestros.nom_moneda nm on me.idmoneda = nm.idmoneda
						LEFT JOIN mod_datosmaestros.nom_pais p ON nm.idpais = p.idpais
                                                WHERE me.idestructuracomun='$estructura' AND me.tipomoneda = 1
						ORDER BY nm.codigo ASC
                                                  ;"
            );
            return array('datos' => $result);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Obtiene todas las monedas de una entidad que tienen tasas configuradas.
     *
     * @param mixed $estructura Identificador de estructura común
     *
     * @return array Monedas
     * @throws Doctrine_Exception
     */
    static function ObtenerMonedasTasasConfiguradas($idestructura)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $query = "SELECT me.idmonedaentidad, me.tipomoneda, me.idestructuracomun, nm.idmoneda,nm.codigo,
                 nm.codigoiso, nm.nombremoneda,
                  CASE WHEN nm.idpais ISNULL THEN nm.organizacion ELSE p.nombrepais END as organizacion,
                  nm.simbolo, nm.presicion, nm.factorredondeo,
                 dt.idtasa,dt.idtipotasa,dt.factordeconversion FROM mod_datosmaestros.dat_monedaentidad me
				 LEFT JOIN mod_datosmaestros.nom_moneda nm on me.idmoneda = nm.idmoneda LEFT JOIN
				 mod_datosmaestros.dat_tasa dt on dt.idmoneda=nm.idmoneda
				  LEFT JOIN mod_datosmaestros.nom_pais p ON nm.idpais = p.idpais
				  WHERE me.idestructuracomun='$idestructura'
                 ORDER BY nm.codigoiso ASC;";
            $result = $conexionActual->fetchAll($query);
            return $result;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

}
