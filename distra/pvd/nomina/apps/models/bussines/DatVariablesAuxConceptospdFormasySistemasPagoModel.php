<?php
class DatVariablesAuxConceptospdFormasySistemasPagoModel extends ZendExt_Model {

    public function DatVariablesAuxConceptospdFormasySistemasPagoModel() {
        parent::ZendExt_Model();
    }
	
    public function adicionarDatVariablesAuxConceptospdFormasySistemasPago($arregloDatos) {

        $obj = new DatVarAuxConceptospdFormasySistemasPago();

        $obj->idconfconceptospdformasysistemaspago 		= $arregloDatos['idconfconceptospdformasysistemaspago'];
        $obj->denominacion                 				= $arregloDatos['denominacion'];
        $obj->formaentrada 								= $arregloDatos['formaentrada'];
        $obj->idconfreportescertificaciones   			= $arregloDatos['idconfreportescertificaciones'];
        $obj->idvariablesconfreportescertificaciones 	= $arregloDatos['idvariablesconfreportescertificaciones'];
        $obj->lugaresdecimalesvariable         		= $arregloDatos['lugaresdecimalesvariable'];
        
        $obj->save();
        return $obj;
    }

    public function eliminarDatVariablesAuxConceptospdFormasySistemasPago($id) {

        $obj = Doctrine::getTable('DatVarAuxConceptospdFormasySistemasPago')->find($id);
        
        $obj->delete();
    }

}
