<?php
class ConfConceptospdFormasySistemasPagoModel extends ZendExt_Model {

    public function ConfConceptospdFormasySistemasPagoModel() {
        parent::ZendExt_Model();
    }

    public function adicionarConfConceptospdFormasySistemas($arregloDatos) {

        $obj = new ConfConceptospdFormasySistemasPago();

        $obj->idperiodopago 						= $arregloDatos['idperiodopago'];
        $obj->idconfconceptosportiposysistemaspago 	= $arregloDatos['idconfconceptosportiposysistemaspago'];
        $obj->formacalculo            				= $arregloDatos['formacalculo'];
        $obj->idexpresionmatematica         		= $arregloDatos['idexpresionmatematica'];
        $obj->lugaresdecimales         		= $arregloDatos['lugaresdecimales'];

        $obj->save();
        return $obj;
    }

    public function modificarConfConceptospdFormasySistemas($id, $arregloDatos) {

        $obj = Doctrine::getTable('ConfConceptospdFormasySistemasPago')->find($id);

        $obj->idperiodopago 						= $arregloDatos['idperiodopago'];
        $obj->idconfconceptosportiposysistemaspago 	= $arregloDatos['idconfconceptosportiposysistemaspago'];
        $obj->formacalculo            				= $arregloDatos['formacalculo'];
        $obj->idexpresionmatematica         		= $arregloDatos['idexpresionmatematica'];
        $obj->lugaresdecimales         		= $arregloDatos['lugaresdecimales'];
        
        $obj->save();
        return $obj;
    }

    public function eliminarConfConceptospdFormasySistemas($id) {

        $obj = Doctrine::getTable('ConfConceptospdFormasySistemasPago')->find($id);
        
        $obj->delete();
    }

    public function existenvariables($id)
    {

        $obj = ConfConceptospdFormasySistemasPago::existenvariables($id);

        return $obj;
    }

    public function existenvariablesaux($id)
    {

        $obj = ConfConceptospdFormasySistemasPago::existenvariablesaux($id);

        return $obj;
    }


    public function crearFormulaNueva($idexpresionmatematica)
    {
		
        //Capturando los campos de la formula
        $arrcamposformula = DatExpresionMatematicaNomina::obtenerCamposFormula($idexpresionmatematica);

        //Capturando los elementos de la formula
        $arrelementosformula = DatElementoExpresionMatematicaNomina::obtenerElementosFormula($idexpresionmatematica);

        //Adicionando los valores en DatExpresionMatematicaNomina
        $obj = new DatExpresionMatematicaNomina();
        $obj->denominacion = $arrcamposformula[0]['denominacion'];
        $obj->expresionamostrar = $arrcamposformula[0]['expresionamostrar'];
        $obj->expresionmostrarconformato = $arrcamposformula[0]['expresionmostrarconformato'];
        $obj->expresionacalcular = $arrcamposformula[0]['expresionacalcular'];
        $obj->save();
        $idexpresionmatematica = $obj->idexpresionmatematica;

        //Adicionando los valores en DatElementoExpresionMatematicaNomina
        foreach ($arrelementosformula as $elemento) {
            $objElem = new DatElementoExpresionMatematicaNomina();
            $objElem->idexpresionmatematica = $idexpresionmatematica;
            $objElem->elemento = $elemento['elemento'];
            $objElem->valormostrar = $elemento['valormostrar'];
            $objElem->tipoelemento = $elemento['tipoelemento'];
            $objElem->idindicador = $elemento['idindicador'];
            $objElem->orden = $elemento['orden'];
            $objElem->save();

        }
        return $idexpresionmatematica;
    }



}
