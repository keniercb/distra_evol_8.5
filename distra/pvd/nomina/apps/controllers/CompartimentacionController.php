<?php

class CompartimentacionController extends ZendExt_Controller_Secure {
    
    public function init() {
        parent::init();
    }
    
    public function compartimentacionAction() {
       	//$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
		$this->render();
	}

    public function buscarcargoscompartimentadosAction() {
        $objC = new SegCompartimentacionNomina();
        $arrC = $objC->ListarCargosCompartimentacion();
        
        foreach($arrC as $k => &$c){
			$arrCargo = $this->integrator->metadatos->DameEstructura($c['idcargo']);
			$c['cargo'] = $arrCargo[0]->denominacion;
		}
        
        echo json_encode(array('datos'=>$arrC));
    }

    public function buscarcategoriasAction() {
        $idcargo 	= $this->_getParam('idcargo');
        $arrC = SegCompartimentacionNominaModel::buscarcategorias($idcargo);

        echo json_encode(array('datos'=>$arrC));
    }
    
     public function guardarcompartimentacionAction() {
        $tipo 			= $this->_getParam('tipo');
        $idcargo 	= $this->_getParam('idcargo');
        $compartimentacion = json_decode(stripslashes($this->_getParam('compartimentacion')));
        
        if($tipo == 1){
			$objSC = new SegCompartimentacionNominaModel();
			$objSC->Adicionar($idcargo);
			$s->codigo = 'ADD-1';
		}else{
			$objSCTN = new SegCompartimentacionCargoPorTipoNominaModel();
			$objSCTN->Modificar($compartimentacion);
			$s->codigo = 'ADD-1';
		}
		
		echo json_encode($s);
        
    }
    /*
     * adicionar categorias de acceso al cargo
     * */
    public function AddCategoriaAction() {
        $idcategoria 			= $this->_getParam('idcategoria');
        $idcargo 	= $this->_getParam('idcargo');

			$objSC = new SegCompartimentacionNominaModel();
			$bool=$objSC->AddCategoria($idcategoria,$idcargo);

        if($bool == 1){
            $s->codigo = 'ADD-1';
        }
        else{
            $s->codigo = 'ADD-2';
        }



		echo json_encode($s);

    }

    public function DelCategoriaAction() {
        $idcompartcargocategoria= $this->_getParam('idcompartcargocategoria');

			$bool=SegCompartimentacionNominaModel::DelCategoria($idcompartcargocategoria);

        if($bool == 1){
            $s->codigo = 'DEL-1';
        }
        else{
            $s->codigo = 'DEL-2';
        }



		echo json_encode($s);

    }
    
    public function cargarcompartimentacionAction() {
        $idcompartimentacionnomina 	= $this->_getParam('idcompartimentacionnomina');
        $objSC = new SegCompartimentacionNomina();
        $r = $objSC->ObtenerCompartimentacion($idcompartimentacionnomina);
        
        echo json_encode(array('datos'=>$r));
		
    }
    
    public function eliminarcompartimentacionAction() {
        $idcompartimentacionnomina 	= $this->_getParam('idcompartimentacionnomina');
        $objSC = new SegCompartimentacionNominaModel();
        $r = $objSC->Eliminar($idcompartimentacionnomina);

        if($r == 1){
            echo "{'codigo':'DEL-1'}";
        }else{
            //Devolviendo una notificación de que todo ocurrió correctamente
            echo "{'codigo':'DEL-2'}";
        }


		
    }
    

}
