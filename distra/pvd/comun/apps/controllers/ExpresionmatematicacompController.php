<?php

class ExpresionmatematicacompController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
    }

    function expresionmatematicacompAction() {
        $this->render();
    }

    function guardarexpresionmatematicaAction() {
        $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
        $denominacion = $this->_request->getPost('denominacion');
        $arrElementos = Zend_Json::decode($this->_getParam('elementos'));//json_decode($this->_getParam('elementos'));
		//print_r($arrElementos);die;
		$expresionamostrar = $this->_request->getPost('expresionamostrar');
        $expresionamostrarconformato = $this->_request->getPost('expresionamostrarconformato');
        $expresionacalcular = $this->_request->getPost('expresionacalcular');
        $objExpMatModel = new DatExpresionmatematicaModel();

        if ($idexpresionmatematica == -1 || $idexpresionmatematica == '') {
            $objExpMat['denominacion'] = $denominacion;
            $objExpMat['expresionamostrar'] = $expresionamostrar;
            $objExpMat['expresionmostrarconformato'] = $expresionamostrarconformato;
            $objExpMat['expresionacalcular'] = $expresionacalcular;
			
			$id = $objExpMatModel->Insertar($objExpMat, $arrElementos);
        } else {
            $objExpMat['denominacion'] = $denominacion;
            $objExpMat['expresionamostrar'] = $expresionamostrar;
            $objExpMat['expresionmostrarconformato'] = $expresionamostrarconformato;
            $objExpMat['expresionacalcular'] = $expresionacalcular;
            $objExpMat['idexpresionmatematica'] = $idexpresionmatematica;
            $id = $objExpMatModel->Actualizar($objExpMat, $arrElementos);
        }

        //Pongo en un arreglo los ID de los indicadores que contiene la expresion matematica
        $arrElInd = array();
        foreach ($arrElementos as $k => $e) {
            if ($e['tipo'] == 6) {
                $arr = explode('I', $e['valor']);
                $arrElInd[] = $arr[1];
            }
        }
		//Guardo los idindicadores de la expresion matematica en un fichero en forma serializada.
        if (count($arrElInd) > 0)
		    $this->GuardarIndicadoresEnFichero($id, $arrElInd);

        $r->codigo = 1;
        $r->mensaje = 'La expresi&oacute;n matem&aacute;tica se guard&oacute; satisfactoriamente.';
        $r->idexpresionmatematica = $id;
        echo json_encode($r);
    }

    //Metodo que guarda en un fichero serializado los id de los indicadores para despues obtenerlos, mejorando asi los tiempos de respuesta
    private function GuardarIndicadoresEnFichero($idexpresionmatematica, $arrIndicadores) {
        $arrdir = explode('index.php', $_SERVER['SCRIPT_FILENAME']);
        $dir = $arrdir[0];
        $s = serialize($arrIndicadores);
        $fp = fopen($dir . "indicadoresexpresonmatematica/{$idexpresionmatematica}.iem", "w");
        fwrite($fp, $s);
        fclose($fp);
    }

    function cargarexpresionmatematicaAction() {
        $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
		$objExpMat = new DatExpresionmatematica();
        $objExpMat = $objExpMat->Buscar($idexpresionmatematica);
		//Hasta aqui llega
        $objElemExpMat = new DatElementoExpresionmatematica();
        $r->denominacion = $objExpMat->denominacion;
        $r->elementos = $objElemExpMat->GetTodosporExpresionMatematica($idexpresionmatematica);
		//print_r($r->elementos);die;
        echo json_encode($r);
    }
    
    function validarexpresionmatematicaAction() {
        $arrElementos = Zend_Json::decode($this->_getParam('elementos'));
        $expresionacalcular = $this->_request->getPost('expresionacalcular');
        $objExpMatModel = new DatExpresionmatematicaModel();
        $r = $objExpMatModel->ValidarExpresionMatematica($expresionacalcular, $arrElementos);
        echo json_encode($r);
    }

}

?>
