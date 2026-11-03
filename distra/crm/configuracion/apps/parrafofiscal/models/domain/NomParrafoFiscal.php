<?php
/**
 * Clase modelo de dominio "Nomenclador P\xE1rrafo Fiscal"
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage P\xE1rrafoFiscal/Models/Domain
 * @copyright  XETID
 * @version    1.0-0
 */
class NomParrafoFiscal extends BaseNomParrafoFiscal
{
	/**
     * Inicializa el padre
     */
    public function setUp()
    {
        parent::setUp();
    }
	/**
     * Elimina un p\xE1rrafo fiscal
     * 
     * @param mixed $param P\xE1rrafo fiscal a eliminar
     * 
     * @return boolean
     */
    public function delPFEntidad($param)
    {
        $del = Doctrine::getTable('NomParrafoFiscal')->find(
            $param['idparrafofiscal']
        );
        $del->delete();
        return true;
    }

    /**     
     * Obtiene los p\xE1rrafos fiscales existentes
     * 
     * @param mixed $idParrafofiscal Identificador de p\xE1rrafo fiscal
     *
     * @return array Objetos de p\xE1rrafos fiscales
     */
    static public function cargarParrafosFiscales($idParrafofiscal)
    {
        $query = Doctrine_Query::create();
        $where = ($idParrafofiscal) ? "npf.idpadre = $idParrafofiscal AND npf.idpadre <> npf.idparrafofiscal"
            : "npf.idpadre = npf.idparrafofiscal";
        return $query->select(
            "npf.idparrafofiscal as id, npf.descripcion, npf.codigo, npf.referencia, npf.fechafin, 
            npf.fechainicio, npf.descripcion as qtip, CONCAT(CONCAT(npf.codigo,' '), npf.descripcion) text, 
            ( (npf.ordender - npf.ordenizq) = 1) as leaf, npf.idparrafofiscal, npf.idpadre, npf.ordender, npf.nivel,
            npf.ordenizq, npf.idformato"
        )
            ->from('NomParrafoFiscal npf')
            ->where($where)
            ->orderby('npf.codigo')
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Verifica primeramente que la fecha inicio y fecha fin de los hijos de un nodo; dado su orden izquierdo y
     * orden derecho, no quede fuera de rango.
     *
     * @param int $ordenizq
     * @param int $ordender
     * @param date $fechainicio
     * @param date $fechafin
     *
     * @author Ing. Lisvany Alonso Martinez
     *
     * @return bool|string
     * @throws Doctrine_Connection_Exception
     */
    static public function cargarTodosHijosParrafosFiscales($ordenizq,
        $ordender, $fechainicio, $fechafin)
    {

        $objDoctrine = Doctrine_Manager::getInstance();
        $conexion = $objDoctrine->getCurrentConnection();
        $resultado = $conexion
            ->fetchAll(
                "SELECT * FROM mod_datosmaestros.nom_parrafofiscal m
                  WHERE (m.ordenizq > $ordenizq AND m.ordender < $ordender AND '"
                . $fechainicio
                . "' > m.fechainicio :: date) ORDER BY m.ordenizq;"
            );
        if (count($resultado) > 0) {
            return 'fechainicio';
        }
        if ($fechafin) {
            $resultadoDos = $conexion
                ->fetchAll(
                    "SELECT * FROM mod_datosmaestros.nom_parrafofiscal m
                      WHERE (m.fechafin != '' AND m.ordenizq > $ordenizq AND m.ordender < $ordender AND '"
                    . $fechafin . "' < m.fechafin) ORDER BY m.ordenizq;"
                );
            if (count($resultadoDos) > 0) {
                return 'fechafin';
            }
        }
        return false;

    }

	/**
     * Obtiene una denominación
     * 
     * @param mixed $filter Condiciones
     *
     * @return mixed  Datos de p\xE1rrafos fiscales
     */
    static public function buscarDenominacion($filter)
    {
        $where = "(npf.codigo ilike '%$filter%' OR npf.descripcion ilike '%"
            . $filter . "%')";
        $query = Doctrine_Query::create();
        $result = $query->select(
            "false visitado, npf.idparrafofiscal as id, ( npf.codigo || ' ' || npf.descripcion) as text,
            ( (npf.ordender - npf.ordenizq) = 1) leaf, npf.codigo, npf.descripcion,
            npf.referencia, npf.idparrafofiscal, npf.idpadre, npf.ordender, npf.ordenizq,npf.idformato"
        )
            ->from('NomParrafoFiscal npf')
            ->where($where)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        /*$utfOcho = array("à" => "À", "è" => "È", "ì" => "Ì", "ò" => "Ò",
                      "ù" => "Ù", "á" => "Á", "é" => "É", "í" => "Í",
                      "ó" => "Ó", "ú" => "Ú", "â" => "Â", "ê" => "Ê",
                      "î" => "Î", "ô" => "Ô", "û" => "Û", "ç" => "Ç");
        foreach ($result as &$parrFiscal) {
            $parrFiscal['text'] = str_ireplace(
                strtr($filter, $utfOcho), "<span style=\"background-color: rgb(255, 255, 0);\">"
                . strtr($filter, $utfOcho) . "</span>", strtr($parrFiscal['text'], $utfOcho)
            );
        }*/
        if ($filter) {
            include_once Zend_Registry::get('config')->dir_aplication .
                'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
            $result = UtilesDatosMaestros::colorSearch($result, 'text', $filter);
        }
        return $result;
    }
	/**     
     * Obtiene un p\xE1rrafo fiscal padre
     * 
     * @param mixed $idpadre Identificador de p\xE1rrafo fiscal padre
     *
     * @return mixed P\xE1rrafo fiscal
     */
    static public function obtenerPadre($idpadre)
    {
        $query = Doctrine_Query::create();
        $result = $query->select(
            "false visitado, npf.idparrafofiscal as id, CONCAT(CONCAT(npf.codigo,' ') ,npf.descripcion) text, 
            ( (npf.ordender - npf.ordenizq) = 1) leaf, npf.codigo, npf.descripcion, npf.referencia, npf.nivel,
            npf.idparrafofiscal, npf.idpadre, npf.ordender, npf.ordenizq"
        )
            ->from('NomParrafoFiscal npf')
            ->where("npf.idparrafofiscal = ?", $idpadre)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }
	/**     
     * Obtiene p\xE1rrafos fiscales
     * 
     * @param mixed $argFilters Condiciones
     *
     * @return mixed P\xE1rrafos fiscales
     */
    static public function getParrafosFiscales($argFilters)
    {
        $idparrafofiscal = explode('-', $argFilters['node']);
        $idparrafofiscal = $idparrafofiscal[0];
        $filter = $argFilters['filter'];
        $where = ($idparrafofiscal) ? "ne.idpadre = $idparrafofiscal AND ne.idpadre <> ne.idparrafofiscal"
            : "ne.idpadre = ne.idparrafofiscal";
        $addWhere
            = " AND ne.codigo ilike '%$filter%' OR ne.descripcion ilike '%$filter%'";
        $query = new Doctrine_Query();
        if ($argFilters['filter'] != '') {
            $result = $query
                ->select(
                    "ne.idparrafofiscal, ne.ordenizq, ne.ordender, ne.codigo, ne.idpadre,ne.descripcion, ne.fechafin, 
                    ne.fechainicio, ne.descripcion as qtip, ne.idparrafofiscal as id,
                    ne.referencia, CONCAT(CONCAT(ne.codigo, ' '), ne.descripcion) text,
                    ( (ne.ordender - ne.ordenizq) = 1) as leaf"
                )
                ->from('NomParrafoFiscal ne')
                ->where($where . $addWhere)
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                ->execute();
            $query->free();
            /*$utfOcho = array("à" => "À", "è" => "È", "ì" => "Ì", "ò" => "Ò",
                          "ù" => "Ù", "á" => "Á", "é" => "É", "í" => "Í",
                          "ó" => "Ó", "ú" => "Ú", "â" => "Â", "ê" => "Ê",
                          "î" => "Î", "ô" => "Ô", "û" => "Û", "ç" => "Ç");
            foreach ($result as & $parrafoFiscal) {
                $parrafoFiscal['text'] = str_ireplace(
                    strtr(strtoupper($filter), $utfOcho),
                    "<span style=\"background-color: rgb(255, 255, 0);\">"
                    . strtr(strtoupper($filter), $utfOcho) . "</span>",
                    strtr(strtoupper($parrafoFiscal['text']), $utfOcho)
                );
            }*/
            $result = UtilesDatosMaestros::colorSearch($result, 'text', $filter);
        } else {
            $result = $query
                ->select(
                    "ne.idparrafofiscal, ne.ordenizq, ne.ordender, ne.codigo, ne.idpadre,ne.descripcion, 
                    ne.fechafin, ne.fechainicio, ne.descripcion as qtip, ne.idparrafofiscal as id, ne.referencia,
                     CONCAT(CONCAT(ne.codigo, ' '), ne.descripcion) text,
                    ( (ne.ordender - ne.ordenizq) = 1) as leaf"
                )
                ->from('NomParrafoFiscal ne')
                ->where($where)
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                ->execute();
            $query->free();
        }
        return $result;
    }
	/**     
     * Verifica la existencia de datos de un p\xE1rrafo fiscal en la Base de Datos
     * 
     * @param mixed $codigo Código de p\xE1rrafo fiscal
     * @param mixed $idparrafoFiscal Identificador de p\xE1rrafo fiscal
     *
     * @return int 1 si existe el p\xE1rrafo fiscal,0 si no existe
     */
    static function verificar($codigo, $idparrafoFiscal, $nivel, $idpadre)
    {
        $tmp = ($idpadre != 0) ? "e.idpadre = $idpadre AND " : "";
        $query = Doctrine_Query::create();
        (!$idparrafoFiscal)
            ? (
        $parrafoFiscal = $query->select('e.codigo')
            ->from('NomParrafoFiscal e')
            ->where("e.codigo = '$codigo' AND ". $tmp ."e.nivel = $nivel")
            ->setHydrationMode(Doctrine_Core::HYDRATE_RECORD)
            ->execute())
            :
            ($parrafoFiscal = $query->select('e.codigo')
                ->from('NomParrafoFiscal e')
                ->where(
                    "e.codigo = '$codigo' AND ". $tmp ."e.idparrafofiscal<>'$idparrafoFiscal' AND e.nivel = $nivel"
                )
                ->setHydrationMode(Doctrine_Core::HYDRATE_RECORD)
                ->execute());
        return $parrafoFiscal->count();
    }
	/**     
     * Obtiene datos de p\xE1rrafos fiscales
     *
     * @return mixed Datos de p\xE1rrafos fiscales
     */
    static function obtenerArrayParrafoFiscal()
    {
        $query = new Doctrine_Query();
        return $query
            ->select(
                "e.idparrafofiscal, e.codigo, e.descripcion, e.idparrafofiscal as id"
            )
            ->from('NomParrafoFiscal e')
            ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Obtiene los hijos de un nodo; dado su orden izquierdo y
     * orden derecho.
     *
     * @param int $ordenizq
     * @param int $ordender
     *
     * @author Ing. Lisvany Alonso Martinez
     *
     * @return bool|string
     * @throws Doctrine_Connection_Exception
     */
    static public function cargarHijosPF($ordenizq,
        $ordender)
    {

        $objDoctrine = Doctrine_Manager::getInstance();
        $conexion = $objDoctrine->getCurrentConnection();
        return $conexion
            ->fetchAll(
                "SELECT * FROM mod_datosmaestros.nom_parrafofiscal m
                  WHERE (m.ordenizq > $ordenizq AND m.ordender < $ordender) ORDER BY m.ordenizq, m.codigo;"
            );
    }

    static function validar(
        $codigo, $descripcion, $nivel, $idparrafofiscal, $idpadre
    )
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexion = $objDoctrine->getCurrentConnection();
        if ($idparrafofiscal != null) {
            $codigoEx = $conexion
                ->fetchAll(
                    "SELECT * FROM mod_datosmaestros.nom_parrafofiscal m
                  WHERE (m.codigo = '$codigo' AND m.idpadre = $idpadre
                  AND m.nivel = $nivel AND m.idparrafofiscal <> $idparrafofiscal);"
                );
            if (count($codigoEx) > 0) {
                return 'codigoEx';
            }
            $descripcionEX = $conexion
                ->fetchAll(
                    "SELECT * FROM mod_datosmaestros.nom_parrafofiscal m
                  WHERE (m.descripcion = '$descripcion' AND m.idpadre = $idpadre
                  AND m.nivel = $nivel AND m.idparrafofiscal <> $idparrafofiscal);"
                );
            if (count($descripcionEX) > 0) {
                return 'descripcionEX';
            }
        } else {
            $codigoEx = $conexion
                ->fetchAll(
                    "SELECT * FROM mod_datosmaestros.nom_parrafofiscal m
                  WHERE (m.codigo = '$codigo' AND m.idpadre = $idpadre AND m.nivel = $nivel);"
                );
            if (count($codigoEx) > 0) {
                return 'codigoEx';
            }
            $descripcionEX = $conexion
                ->fetchAll(
                    "SELECT * FROM mod_datosmaestros.nom_parrafofiscal m
                  WHERE (m.descripcion = '$descripcion' AND m.idpadre = $idpadre AND m.nivel = $nivel);"
                );
            if (count($descripcionEX) > 0) {
                return 'descripcionEX';
            }
        }
    }

}
