<?php

/**
 * Created by JetBrains PhpStorm.
 * User: lester
 * Date: 31/07/13
 * Time: 16:41
 * To change this template use File | Settings | File Templates.
 */
class DocumentoExpediente extends NomencladoresGeneralesModel {
    
    public function DocumentoExpediente() {
       
        parent::NomencladoresGeneralesModel();
    }

    public function buscar($obj) {
        $obj['alias'] = 'mm';
        $arrQuery = parent::buscar($obj, array(), true);
        $data = array();
        $objQuery = $arrQuery['query'];
        $a = $objQuery->fetchArray();
        foreach ($a as $key => $value) {
            $data[] = $value;
            if ($value['estado'] == '')
                $data[$key]['estado'] = 1;
        }
        return array('cantidad' => $objQuery->count(), 'datos' => $data);
    }

    public function GetDocexpedienteNorte($parametros) {
 
        $global = ZendExt_GlobalConcept::getInstance();        
        $parametros['idestructura'] = $global->Estructura->idestructura;
        $datos = NomDocumentoExpediente::GetDocexpedienteNorte($parametros);
        $total = NomDocumentoExpediente::GetCantDocexpedienteNorte($parametros);

        return array('cantidad' => $total, 'datos' => $datos);
    }

    public function GetDocexpedienteSur($parametros) {
        $datos = NomDocumentoExpediente::GetDocexpedienteSur($parametros);
        $total = NomDocumentoExpediente::GetCantDocexpedienteSur($parametros);

        return array('cantidad' => $total, 'datos' => $datos);
    }

    public function InsertarDocexpedienteNorte($parametros) {
        if (!$parametros['culminacion']) {
            $parametros['culminacion'] = 0;
        }
        return parent::InsertarNomenclador($parametros);
    }

    public function ModificarDocexpedienteNorte($parametros) {
        if (!$parametros['culminacion']) {
            $parametros['culminacion'] = 0;
        }

        return parent::ModificarNomenclador($parametros);
    }

    public function habilitardesabiltarentidad($parametro) {  

        return parent::habilitarDesabiltarEntidad($parametro);
    }

    public function EliminarDocexpedienteNorte($estados, $modificar = array()) {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        foreach ($estados as $key => $idexpediente) {

            try {
                Doctrine::getTable('NomDocumentoExpediente')->find($idexpediente)->delete();
            } catch (Doctrine_Connection_Pgsql_Exception $e) {

                if ($e->getCode() == '23503') {

                    unset($estados[$key]);
                    $modificar[] = $idexpediente;

                    if ($conn->getTransactionLevel() != 0) {
                        $conn->rollBack();
                    }

                    self::EliminarDocexpedienteNorte($estados, $modificar);
                }
            }
        }

        if ($modificar) {

            $conn = Zend_Registry::get('conexion');
            $arr = implode(',', $modificar);
            $conn->execute(
                    "UPDATE mod_logactivofijotangible.nom_expedienteactivo SET estado = 0 WHERE (idexpediente IN ($arr))"
            );

            return 3;
        }

        //
        //        self::EliminarEstadosOperSinAsociacion();

        return true;
    }
    
    public function ActualizarIdTabla($parametros){
		$docExp = new NomDocumentoExpediente();
		$docExp->assignIdentifier($parametros['idexpediente']);
		$docExp->synchronizeWithArray($parametros);
		$docExp->save();
		return true;
	}

}
