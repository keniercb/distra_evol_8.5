<?php

/**
 * Clase dominio <b>Nomenclador de Monedas</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain
 * @copyright  XETID
 * @version    1.0-0
 */
class NomMoneda extends BaseNomMoneda
{
    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasMany(
            'DatMonedaEntidad',
            array('local' => 'idmoneda', 'foreign' => 'idmoneda')
        );
        parent::setUp();
    }

    /**
     * Obtiene código iso y nombre de monedas.
     *
     * @return mixed Monedas(código iso,nombre de moneda)
     * @throws Doctrine_Exception
     */
    static public function getNomMonedas()
    {
        try {
            $query = Doctrine_Query::create();
            return $query
                ->select("nm.codigoiso, nm.nombremoneda, nm.organizacion, nm.simbolo")
                ->from('NomMoneda nm')
                ->orderby("nm.codigoiso")
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                ->execute();
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Obtiene monedas  por un límite.
     *
     * @param array $cond       Condiciones
     * @param int   $agStart    Inicio
     * @param int   $agLimit    Límite
     * @param mixed $estructura Identificador de estructura
     *
     * @return mixed Monedas
     * @throws Doctrine_Exception
     */
    static public function getMonedasByLimit($cond = array(), $agStart = 0, $agLimit = 20, $estructura = 0)
    {
        try {
            $filter = " 0=0 ";
            if ($cond['idmoneda']) {
                $filter .= " and nm.idmoneda = '" . $cond['idmoneda'] . "'";
            }
            if ($cond['codigoiso']) {
                $filter .= " and nm.codigoiso ilike '%" . $cond['codigoiso']
                    . "%'";
            }
            if ($cond['nombremoneda']) {
                $filter
                    .= " and nm.nombremoneda ilike '%" . $cond['nombremoneda']
                    . "%'";
            } elseif ($cond['sfFiltro']) {
                $filter .= " and nm.nombremoneda ilike '%" . $cond['sfFiltro']
                    . "%' OR nm.organizacion ilike '%" . $cond['sfFiltro']
                    . "%' OR nm.codigoiso ilike '%" . $cond['sfFiltro']
                    . "%' OR nm.codigo ilike '%" . $cond['sfFiltro'] . "%'";
            }
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $query = "SELECT nm.idmoneda,
                 nm.codigo,
                 nm.codigoiso,
                 nm.nombremoneda,
                 CASE WHEN nm.idpais ISNULL THEN nm.organizacion ELSE p.nombrepais END as organizacion,
                 nm.simbolo,
                 nm.presicion,
                 nm.factorredondeo,
                 nm.idpais,
                 me.idmonedaentidad,
                 case WHEN me.idestructuracomun = $estructura THEN me.tipomoneda ELSE NULL END AS tipomoneda,
                 me.dualidad,
                 me.idestructuracomun
                 ,case WHEN me.idestructuracomun = $estructura THEN 1 ELSE 0 END as enuso
               FROM mod_datosmaestros.nom_moneda nm
                 LEFT JOIN mod_datosmaestros.dat_monedaentidad me on nm.idmoneda = me.idmoneda
                 and me.idestructuracomun = $estructura
                 LEFT JOIN mod_datosmaestros.nom_pais p ON nm.idpais = p.idpais
               WHERE $filter ORDER BY enuso DESC,tipomoneda ASC,dualidad DESC";

            $extra = " OFFSET $agStart LIMIT $agLimit";

            $result = $conexionActual->fetchAll($query.$extra);
            $query ="SELECT count(a.idmoneda) as cantidad FROM ($query)a";
            $count = $conexionActual->fetchAll($query);

            return array('data'=>$result,'count'=>$count[0]['cantidad']);
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Obtiene monedas.
     *
     * @param mixed $idmoneda Identificador de moneda
     *
     * @return mixed Monedas(identificador de moneda,código iso,nombre de moneda)
     * @throws Doctrine_Exception
     */
    static function buscarMonedas($idmoneda = 0)
    {
        try {
            $q = Doctrine_Query::create();
            if (!$idmoneda) {
                $monedas = $q->select("idmoneda,codigoiso,nombremoneda")->from(
                    'NomMoneda e'
                )->orderby("idmoneda")->setHydrationMode(
                    Doctrine :: HYDRATE_ARRAY
                )->execute();
            } else {
                $monedas = $q->select("idmoneda,codigoiso,nombremoneda")->from(
                    'NomMoneda e'
                )->where("e.idmoneda='$idmoneda'")->orderby("idmoneda")
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();
            }
            return $monedas;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Obtiene monedas  a partir de una consulta SQL.
     *
     * @param array $cond    Condiciones
     * @param int   $agLimit Límite
     * @param int   $agStart Inicio
     *
     * @return array Monedas
     * @throws Doctrine_Exception
     */
    static public function buscar($cond = array(), $agLimit = 20, $agStart = 0)
    {
        try {
            $filter = " 0=0 ";
            if ($cond['idmoneda']) {
                $filter .= " and nm.idmoneda = '" . $cond['idmoneda'] . "'";
            }
            if ($cond['codigoiso']) {
                $filter .= " and nm.codigoiso ilike '%" . $cond['codigoiso']
                    . "%'";
            }
            if ($cond['nombremoneda']) {
                $filter
                    .= " and nm.nombremoneda ilike '%" . $cond['nombremoneda']
                    . "%'";
            }
            $queryDql = Doctrine_Query::create();
            $result = $queryDql
                ->select("nm.codigoiso, nm.nombremoneda")
                ->addSelect(
                    'nm.idmoneda, nm.codigoiso, nm.nombremoneda, nm.codigo'
                )
                ->from('NomMoneda nm')
                ->where($filter)
                ->orderby("nm.codigoiso")
                ->offset($agStart)
                ->limit($agLimit)
                ->execute();
            return array('cant'  => $result->count(),
                         'datos' => $result->toArray());
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

}