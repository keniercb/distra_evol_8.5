<?php
/**
 * Clase modelo de dominio "P\xE1rrafo Fiscal"
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage P\xE1rrafoFiscal/Models/Domain
 * @copyright  XETID
 * @version    1.0-0
 */
class DatParrafoFiscalEntidad extends BaseDatParrafoFiscalEntidad
{
	/**
     * Inicializa el padre
     */
    public function setUp()
    {
        parent::setUp();
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
        $query = Doctrine_Query::create();
        $result = $query->from('DatParrafoFiscalEntidad')->where(
            "idparrafofiscal = ? AND idestructuracomun = ?",
            array($idparrafo, $idestructura)
        )->execute();
        return $result->toArray();
    }
	/**     
     * Verifica la existencia de datos de un p\xE1rrafo fiscal en la Base de Datos
     * 
     * @param mixed $datos Datos de p\xE1rrafo fiscal
     * @param mixed $llave Identificador de p\xE1rrafo fiscal
     *
     * @return boolean
     */
    public function verificar($datos, $llave)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('DatParrafoFiscalEntidad')->where(
            "idparrafofiscalentidad = $llave"
        )->execute()->toArray();
        if (!empty($result) || $result[0]['fechainicio'] != $datos['fechainicio']
            || $result[0]['fechafin'] != $datos['fechafin']
            || $result[0]['referencia'] != $datos['referencia']
        ) {
            return true;
        } else {
            return false;
        }
    }
	/**     
     * Valida que un p\xE1rrafo fiscal pertenezca a determinada estructura común
     * 
     * @param mixed $idpf Identificador de p\xE1rrafo fiscal
     * @param mixed $idest Identificador de estructura común
     *
     * @return boolean
     */
    public function validar($idpf, $idest)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('DatParrafoFiscalEntidad')->where(
            "idparrafofiscal = $idpf and idestructuracomun = $idest"
        )->execute()->toArray();
        if (empty($result)) {
            return true;
        } else {
            return false;
        }
    }
	/**     
     * Valida la existencia de una estructura común
     * 
     * @param mixed $idest Identificador de estructura común
     *
     * @return boolean
     */
    public function validare($idest)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('DatParrafoFiscalEntidad')->where(
            "idestructuracomun = " . $idest
        )->execute()->toArray();
        if (empty($result)) {
            return false;
        } else {
            return true;
        }
    }
	/**     
     * Modifica un p\xE1rrafo fiscal
     * 
     * @param mixed $param Datos de p\xE1rrafo fiscal a modificar
     *
     * @return mixed True si modifica correctamente,-4 si no modifica
     */
    public function modPFEntidad($param)
    {

        try {
            $mod = Doctrine::getTable('DatParrafoFiscalEntidad')->find(
                $param['idparrafofiscalentidad']
            );
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $mod->fechaini = $param['fechaini'];
            $mod->fechafin = $param['fechafin'];
            $mod->referencia = $param['referencia'];
            $mod->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                return '-4';
            }
        }


        return true;
    }
	/**     
     * Elimina un p\xE1rrafo fiscal
     * 
     * @param mixed $key Identificador de p\xE1rrafo fiscal
     *
     * @return boolean
     * 
     * @throws Exception
     */
    public function delPFEntidad($key)
    {
        try {
            $del = Doctrine::getTable('DatParrafoFiscalEntidad')->find($key);
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $del->delete();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $exc) {
            $cc->rollback();
            throw $exc;
        }
    }
	/**     
     * Elimina un p\xE1rrafo fiscal original
     * 
     * @param mixed $param Datos del p\xE1rrafo fiscal a eliminar
     *
     * @return boolean
     */
    public function delPFEntidadOriginal($param)
    {
        $del = Doctrine::getTable('DatParrafoFiscalEntidad')->find(
            $param['idparrafofiscalentidad']
        );

        if ($del) { //mio, para eliminar cualquier parrafo-->lelo  16/02/2010  //echo 'ent-->';exit;
            $del->delete();
        } else {  //todo el else es mio, para eliminar cualquier parrafo-->lelo  16/02/2010
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            return $conn->fetchAll(
                "delete from mod_datosmaestros.nom_parrafofiscal where 
                mod_nomencladores.nom_parrafofiscal.idparrafofiscal = $param[idparrafofiscalentidad]"
            );
        }
        return true;
    }

}
