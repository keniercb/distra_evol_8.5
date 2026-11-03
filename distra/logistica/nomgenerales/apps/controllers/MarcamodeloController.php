<?php

class MarcamodeloController extends ZendExt_Controller_Secure
{

    private $marcamodeloModel;

    public function init()
    {
        $this->marcamodeloModel = new MarcamodeloModel();
        parent :: init();
    }

    public function marcamodeloAction()
    {
        $this->render();
    }

    public function cargarnomencladorAction()
    {
        $parametros = $this->_request->getPost();
        $parametros['incluirvencidas'] = 2;
        $parametros['start'] = ($parametros['start']) ? $parametros['start'] : 0;
        $parametros['limit'] = ($parametros['limit']) ? $parametros['limit'] : 30;       
        if ($parametros['idpadre']) {
            $resultado = $this->marcamodeloModel->GetModelos($parametros);

        } else {
            $resultado = $this->marcamodeloModel->GetMarcas($parametros);
        }
        echo(json_encode($resultado));
    }

    public function insertarnomencladorAction()
    {
        $parametros = $this->_request->getPost();
        $etiq = 'msjAddDescexistMarca';
        $origen = 'marca';

        if ($parametros['idpadre'] && $parametros['modelo']== 'NomModelo') {
            $duplicado = $this->marcamodeloModel->InsertarModelo($parametros);
            $etiq = 'msjAddDescExistMarcDistinta';
            $origen = 'modelo';

        } else // false - No duplicado, identificador - Duplicado distinta naturaleza, 2 - Dup misma naturaleza
        {
            $duplicado = $this->marcamodeloModel->InsertarMarca($parametros);
        }       
        if (!$duplicado) {
            echo "{'cod': '0',success: 'true'}";

        } elseif ($duplicado == 'dup') {
            if($parametros['modelo'] == "NomModelo"){
                echo ("{'cod': '2', 'etiqueta':'msjAddDescexistModelo'}");
            }else{
                echo ("{'cod': '2', 'etiqueta':'msjAddDescexistMarca'}"); 
            }

        } else {
            echo ("{'cod': '$duplicado', 'etiqueta':'$etiq', 'idmarcamodelo' : '$duplicado', 'origen':'$origen'}");
        }
    }

    public function duplicarMarcaPorNaturalezaAction()
    {

        try {
            $parametros = $this->_request->getPost();

            if ($parametros['idmarcadupl']) {
                $this->marcamodeloModel->DuplicarMarcaPorNaturaleza($parametros);

            } else {
                $this->marcamodeloModel->DuplicarModeloPorMarca($parametros);
            }
            echo json_encode(array('success' => true));

        } catch (Exception $e) {
            echo json_encode(array('success' => false, 'error' => $e->getMessage()));
        }
    }

    public function modificarnomencladorAction()
    {
        $parametros = $this->_request->getParams();
        $parametros['idpadre'] = $parametros['idmarca'];
        unset($parametros['idmarcaReal']);

        if ($parametros['modelo'] == 'NomModelo') {
            $res = $this->marcamodeloModel->ModificarModelo($parametros);
            $etiq = 'msjModDesceloexistModelo';

        } else {
            $res = $this->marcamodeloModel->ModificarMarca($parametros);
            $etiq = 'msjModDescexistMarca';
        }

        if ($res == 1) {
            echo "{'cod':'0', success: 'true'}";

        } elseif ($res == 'dup') {
            echo ("{'cod':'2','modificar':'true' ,'etiqueta':'$etiq'}");

        } else {
            echo ("{'cod': '$res', 'etiqueta':'msjAddDescExistNatDistinta', 'idmarcamodelo' : '$res'}");
        }

    }

    public function eliminarnomencladorAction()
    {
              
        $parametros = $this->_request->getParams();

       // if ($parametros['idnaturaleza']) {

            if ($parametros['modelo'] == 'NomMarca') {
                $res = $this->marcamodeloModel->EliminarMarca($parametros);

            } else  if ($parametros['modelo'] == 'NomModelo'){
                $res = $this->marcamodeloModel->EliminarModelo($parametros);
            }

        //} else {
            //$res = $this->marcamodeloModel->EliminarNomenclador($parametros);
        //}

        if ($res) {
            echo "{'CodMsg':1, success: 'true'}";
        } else {
            echo ("{'CodMsg':3,'mensaje':'No se puede eliminar.'}");
        }
    }

    public function habilitardesabiltarentidadAction()
    {
        $parametros = $this->_request->getParams();
        $res = $this->marcamodeloModel->habilitarDesabiltarEntidad($parametros);
        if ($res) {
            echo "{success: 'true'}";
        } else {
            echo "{success: 'false'}";
        }
    }

    public function activarnomencladorAction()
    {
        $parametros = $this->_request->getParams();
        $res = $this->marcamodeloModel->ActivarNomenclador($parametros);
        if ($res) {
            echo "{success: 'true'}";
        } else {
            echo "{success: 'false'}";
        }
    }

    public function getnaturalezasAction()
    {
        echo json_encode($this->integrator->datosmaestros->ObtenerDatosArbolNaturaleza($this->_request->getPost()));
    }

    public function adicionarmodeloAction()
    {

    }

    public function modificarmodeloAction()
    {

    }
}