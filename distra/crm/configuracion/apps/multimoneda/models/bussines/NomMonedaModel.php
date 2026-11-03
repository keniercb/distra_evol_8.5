<?php

/**
 * Clase modelo <b>Nomenclador de Monedas</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Bussines
 * @copyright  XETID
 * @version    1.0-0
 */
class NomMonedaModel extends ZendExt_Model
{
    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Adiciona una moneda
     *
     * @param NomMoneda $objNomMoneda Moneda a ser adicionada
     *
     * @return boolean
     * @throws Doctrine_Exception
     */
    static public function adicionarNomMoneda(NomMoneda $objNomMoneda)
    {
        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        try {
            $cc->beginTransaction();
            $objNomMoneda->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $e) {
            $cc->rollback();
            throw $e;
        }
    }

    /**
     * Verifica si existe una moneda
     *
     * @param NomMoneda $objNomMoneda Moneda a ser verificada
     *
     * @return int -2 ya existe el código,-3 ya existe el código iso,-4 ya existe el nombre,-1 no existe la moneda
     */
    static public function verificarExisteMoneda(NomMoneda $objNomMoneda)
    {
        $objArray = $objNomMoneda->toArray();
        $query = Doctrine_Query::create();
        $where = ($objArray['idmoneda'])
            ? "nm.idmoneda <> '$objNomMoneda->idmoneda' AND (nm.nombremoneda iLIKE '$objNomMoneda->nombremoneda'
                OR nm.codigoiso ilike '$objNomMoneda->codigoiso' OR nm.codigo ilike '$objNomMoneda->codigo'
                AND nm.idpais = '$objNomMoneda->idpais')"
            : "nm.nombremoneda iLIKE '$objNomMoneda->nombremoneda'  OR nm.codigoiso ilike '$objNomMoneda->codigoiso'
                OR nm.codigo ilike '$objNomMoneda->codigo' AND nm.idpais = '$objNomMoneda->idpais'";
        $result= $query->select('nm.idmoneda')
            ->from('NomMoneda nm')
            ->where($where);
            $query->execute();
        //die($result);
        if ($result->count() > 0) {
            return -2;
        }
        return -1;
    }

    /**
     * Modifica una moneda
     *
     * @param NomMoneda $objNomMoneda Moneda a ser modificada
     *
     * @return boolean
     * @throws Doctrine_Exception
     */
    static public function modificarNomMoneda(NomMoneda $objNomMoneda)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objNomMoneda->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Elimina una moneda
     *
     * @param NomMoneda $objNomMoneda Moneda a ser eliminada
     *
     * @return boolean
     * @throws Doctrine_Exception
     */
    static public function eliminarNomMoneda(NomMoneda $objNomMoneda)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objNomMoneda->delete();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                return "-3";
            }
        }
    }

    /**
     * Elimina varias monedas
     *
     * @param array $agArrayIdMonedas Monedas a ser eliminadas
     *
     * @return boolean
     * @throws Doctrine_Exception
     */
    static public function eliminarVariasMonedas($agArrayIdMonedas)
    {
        try {
            $collectionMonedas = new Doctrine_Collection('NomMoneda');
            foreach ($agArrayIdMonedas as $indexMoneda => $idMoneda) {
                $collectionMonedas[$indexMoneda] = Doctrine::getTable(
                    'NomMoneda'
                )->find($idMoneda);
            }
            $collectionMonedas->delete();
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                return '-3';
            }
        }
    }

    /**
     * Obtiene varias monedas
     *
     * @param array $agArrayFilterSql Filtro SQL a aplicar  a la búsqueda
     * @param int   $agStart          Comienzo
     * @param int   $agLimit          Límite
     * @param mixed $estructura       Esctructura de las monedas
     *
     * @return array Cantidad y datos de las monedas
     */
    static public function obtenerNomMonedas($agArrayFilterSql, $agStart, $agLimit, $estructura)
    {
        $result = NomMoneda::getMonedasByLimit($agArrayFilterSql, $agStart, $agLimit, $estructura);
        return array('cant' => $result['count'], 'datos' => $result['data']);
    }

    /**
     * Obtiene datos para el reporte de monedas
     *
     * @return array Datos del reporte
     */
    public function obtenerDatosImprimirReporte()
    {
        list($dia, $mes, $year) = explode("/", date('d/m/Y'));
        $entidad = $this->global->Estructura;
        return array('datoGeneral' => array('reporte' => '20004',
                                            'titulo' => 'nommoneda',
                                            'Entidad' => $entidad->denominacion,
                                            'dia' => $dia, 'mes' => $mes,
                                            'year' => $year,
                                            'fechaactual' => date('d/m/Y')),
                     'datoCuerpo'  => NomMoneda::getNomMonedas());
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_moneda
     * @param Doctrine_Query $dql consulta en dql
     * @param string $asExt alias de la tabla que se une con nom_moneda
     * @param string $asLoc alias de la tabla nom_operaiones
     * @param numeric $join Si se unen las tablas con innerjoin o leftjoin
     * @return Doctrine_Query
     */
    public function addQueryJoinMoneda($dql, $asExt, $asLoc = 'no', $join = 1)
    {
        if ($join == 1) {
            $dql->innerJoin("{$asExt}.NomMoneda {$asLoc}");
        } else {
            $dql->leftJoin("{$asExt}.NomMoneda {$asLoc}");
        }
        return $dql;
    }

}



