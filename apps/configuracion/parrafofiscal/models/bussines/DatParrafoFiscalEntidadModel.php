<?php
/**
 * Clase modelo de P\xE1rrafo Fiscal
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage P\xE1rrafoFiscal/Models/Bussines
 * @copyright  XETID
 * @version    1.0-0
 */
class DatParrafoFiscalEntidadModel extends ZendExt_Model
{
    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
    }
    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        parent::setUp();
    }
    /**
     * Adiciona un p\xE1rrafo fiscal
     *
     * @param DatParrafoFiscalEntidad $datParrafoFiscalEntidad P\xE1rrafo fiscal a adicionar
     *
     * @return mixed True si adiciona correctamente, -4 si no adiciona
     */
    public function Insertar(DatParrafoFiscalEntidad $datParrafoFiscalEntidad)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $datParrafoFiscalEntidad->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                return '-4';
            }
        }
    }
    /**
     * Modifica un p\xE1rrafo fiscal
     *
     * @param mixed $param P\xE1rrafo fiscal a modificar
     *
     * @return mixed True si modifica correctamente, -4 si no modifica
     *
     * @throws Doctrine_Exception
     */
    public function Modificar($param)
    {
        try {
            $result = DatParrafoFiscalEntidad::modPFEntidad($param);
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;

        }
    }
    /**
     * Elimina un p\xE1rrafo fiscal
     *
     * @param DatParrafoFiscalEntidad $datParrafoFiscalEntidad P\xE1rrafo fiscal a adicionar
     *
     * @return boolean True si elimina correctamente
     */
    public function Eliminar($param)
    {
        $result = DatParrafoFiscalEntidad::delPFEntidad($param);
        return $result;
    }

    /**
     * Obtiene un p\xE1rrafo fiscal
     *
     * @param mixed $idparrafo Identificador de p\xE1rrafo fiscal
     * @param mixed $idestructura Identificador de estructura común
     *
     * @return array P\xE1rrafo fiscal
     */
    public function getPFEntidad($idparrafo, $idestructura)
    {
        $result = DatParrafoFiscalEntidad::getPFEntidad(
            $idparrafo, $idestructura
        );

        return $result;
    }

    /**
     * Verifica la existencia de datos de un p\xE1rrafo fiscal en la Base de Datos
     *
     * @param mixed $datos Datos de un p\xE1rrafo fiscal
     * @param mixed $llave Identificador de un p\xE1rrafo fiscal
     *
     * @return boolean
     */
    public function verificar($datos, $llave)
    {
        $result = DatParrafoFiscalEntidad::verificar($datos, $llave);

        return $result;
    }

    /**
     * Valida que un p\xE1rrafo fiscal pertenezca a una determinada estructura común
     *
     * @param mixed $idpf Identificador de p\xE1rrafo fiscal
     * @param mixed $idest Identificador de estructura común
     *
     * @return boolean
     */
    public function validar($idpf, $idest)
    {
        $result = DatParrafoFiscalEntidad::validar($idpf, $idest);

        return $result;
    }

    /**
     * Valida la existencia de algún p\xE1rrafo fiscal a una determinada estructura común
     *
     * @param mixed $idest Identidicador de estructura común
     *
     * @return boolean
     */
    public function validare($idest)
    {
        $result = DatParrafoFiscalEntidad::validare($idest);

        return $result;
    }

}