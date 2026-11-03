<?php
class NomtipodiaController extends ZendExt_Controller_Secure {

    function init () {
        parent::init();
    }

    function tipodiaAction() {
        $this->render();
    }

    function cargarDiasAction()
    {
        $obj = new NomTipodiaModel();
        if($this->_request->getPost ( 'criterio' )==-1)
        {
            $limit = $this->_request->getPost ( 'limit' );
            $start = $this->_request->getPost ( 'start' );
            $r['datos'] = $obj->GetByLimit($limit, $start);
            $total = $obj->GetAll();
            $r['cantidad'] = count($total);
            echo (json_encode ($r));
        }
        else
        {
            if($this->_request->getPost ( 'criterio' )!="")
            {
                $limit = $this->_request->getPost ( 'limit' );
                $start = $this->_request->getPost ( 'start' );
                $criterio=$this->_request->getPost ( 'criterio' );
                $r['datos'] = $obj->GetByLimitFind($criterio,$limit, $start);
                $totalbusq = $obj->GetAllFind($criterio);
                $r['cantidad'] = count($totalbusq);
                echo (json_encode ($r));
            }
            else
            {
                $r['datos'] ="";
                $r['cantidad'] = 0;
                echo (json_encode ($r));
            }
        }
    }

	function adicionarDiasAction()
    {
        $model = new NomTipodiaModel();
        $existe = $model->Existe($this->_request->getPost ('denom'));
        if(count($existe) == 0)
        {
            $obj = new NomTipodia();
            $obj->denominacion = $this->_request->getPost ('denom');
            $obj->descripcion = $this->_request->getPost ('descrip');
            $obj->fdesde = $this->_request->getPost ('fechaini');
            if($this->_request->getPost ('fechafin') == '')
                $ff = null;
            else
                $ff = $this->_request->getPost ('fechafin');
            $obj->fhasta = $ff;
            $obj->trabajo = ($this->_request->getPost ('trabajo') == 'true')?1:0;
            $obj->color = '#'.$this->_request->getPost ('color');

            $model->Insertar($obj);
            $r['cod'] =1;
            echo (json_encode ($r));
        }
        else
        {
            $r['cod'] =3;
            echo (json_encode ($r));
        }
    }

	function modificarDiasAction()
    {
        $model = new NomTipodiaModel();
        $cambiodenom = $this->_request->getPost ('cambiodenom');
        if($cambiodenom == 'true')
        {
            $existe = $model->Existe($this->_request->getPost ('denom'));
        }

        if($cambiodenom == 'false' ||( $cambiodenom == 'true' && count($existe) == 0))
        {
            $obj = Doctrine::getTable('NomTipodia')->find($this->_request->getPost('idtipodia'));

            $obj->denominacion = $this->_request->getPost ('denom');
            $obj->descripcion = $this->_request->getPost ('descrip');
            $obj->fdesde = $this->_request->getPost ('fechaini');
            if($this->_request->getPost ('fechafin') == '')
                $ff = null;
            else
                $ff = $this->_request->getPost ('fechafin');
            $obj->fhasta = $ff;
            $obj->trabajo = ($this->_request->getPost ('trabajo') == 'true')?1:0;
            $obj->color = '#'.$this->_request->getPost ('color');
            $model->Actualizar($obj);
            $r['cod'] =1;
            echo (json_encode ($r));
        }
        else
        {
            $r['cod'] =3;
            echo (json_encode ($r));
        }
    }

	function eliminarDiasAction()
    {
        $modeloNegocio = new NomTipodiaModel();
        $resp =  $modeloNegocio->Eliminar($this->_request->getPost ('idtipodia'));
        if ($resp == false) {
            $m->codMsg = 3;
            echo json_encode($m);
        } else {
            $m->codMsg = 1;
            echo json_encode($m);
        }
    }

}
?>
