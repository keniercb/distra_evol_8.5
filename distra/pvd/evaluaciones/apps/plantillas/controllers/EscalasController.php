<?php

class EscalasController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function escalasAction()
    {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

//Devuelve todas las esalas
    function todasescalasAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $filtro = $this->_request->getPost('filtro');
        $objEscala = new DatEvalescala();
        if ($filtro) {
            $r['datos'] = $objEscala->getEscalasByDenom($filtro, $limit, $start);
            $r['cantidad'] = $objEscala->GetCantTotalByDenom($filtro);
        } else {
            $r['datos'] = $objEscala->GetPorLimite($limit, $start);
            $r['cantidad'] = $objEscala->GetCantTotal($filtro);
        }

        echo(json_encode($r));
    }

//Adiciona una escala
    function adicionarescalaAction()
    {
        $objEscala = new DatEvalescala();
        $objEscala->denom = $this->_request->getPost('denom');
        $objEscala->descripcion = $this->_request->getPost('descrip');
        $objEscala->tipoescala = $this->_request->getPost('tipoEscala');
        $objEscala->desde = $this->_request->getPost('fi');

        if ($this->_request->getPost('ff') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('ff');
        $objEscala->hasta = $ff;

        $objEscalaModel = new DatEvalescalaModel();
        $objEscalaModel->Insertar($objEscala);
        $r->codMsg = 1;
        $r->mensaje = "La escala ha sido adicionada satisfactoriamente.";

        echo(json_encode($r));
    }

//Modifica una escala
    function modificarescalaAction()
    {
        $idescala = $this->_request->getPost('idescala');
        $objEscala = Doctrine::getTable('DatEvalescala')->find($idescala);
        $objEscala->denom = $this->_request->getPost('denom');
        $objEscala->descripcion = $this->_request->getPost('descrip');
        $objEscala->tipoescala = $this->_request->getPost('tipoEscala');
        $objEscala->desde = $this->_request->getPost('fi');
        if ($this->_request->getPost('ff') == '')
            $ff = null;
        else
            $ff = $this->_request->getPost('ff');
        $objEscala->hasta = $ff;
        $objEscalaModel = new DatEvalescalaModel();
        $objEscalaModel->Actualizar($objEscala);
        $r->codMsg = 1;
        $r->mensaje = "La escala ha sido modificada satisfactoriamente.";

        echo(json_encode($r));
    }

//Elimina una escala
    function eliminarescalaAction()
    {
        try {
            $idescala = $this->_request->getPost('idEscala');
           // $objEscala = Doctrine::getTable('DatEvalescala')->find($idescala);
            $objEscalaModel = new DatEvalescalaModel();
            $objEscalaModel->Eliminar($idescala);
            $r->codMsg = 1;
            $r->exception = 0;
            $r->mensaje = "La escala ha sido eliminada satisfactoriamente.";
            echo(json_encode($r));
        } catch (Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;
                echo(json_encode($r));
            } else {
                echo(json_encode($e->getMessage()));
            }
        }
    }

//Devuelve todos los valores cualitativos no seleccionados
    function valorescualitativosnoselecAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idescala = $this->_request->getPost('idescala');

        $filtro = $this->_request->getPost('filtro');

        $objValoresCualitativos = new NomEvalvalorescualitativos();
        if ($filtro == '') {
            $r['datos'] = $objValoresCualitativos->GetPorLimite($limit, $start,$idescala);
            $r['cantidad'] = $objValoresCualitativos->GetCantTotal();
        } else {
            $r['datos'] = $objValoresCualitativos->BuscarPorFiltro($limit, $start, $filtro,$idescala);
            $r['cantidad'] = $objValoresCualitativos->GetCantTotalporFiltro($filtro,$idescala);
        }
        if($r['datos']!=null){
            echo(json_encode($r));
        }
        else{
            return 'El valor cualitativo se encuentra en uso';
        }


    }

//Busca un rango num�rico dado una escala
    function buscarrangonumericoAction()
    {
        $idescala = $this->_request->getPost('idescala');
        $DatEvalescalarangonumerico = new DatEvalescalarangonumerico();
        $r = $DatEvalescalarangonumerico->Buscar($idescala);
        echo(json_encode($r));
    }

//Guarda el rango num�rico y todos sus valores
    function guardarrangonumericoAction()
    {
        $idescala = $this->_request->getPost('idescala');
        $valorinicial = (float)$this->_request->getPost('valorinicial');
        $valorfinal = (float)$this->_request->getPost('valorfinal');
        $paso = (float)$this->_request->getPost('paso');
        $representacion = (float)$this->_request->getPost('representacion');
        $precision = (float)$this->_request->getPost('precision');

        $objDatEvalescalarangonumerico = new DatEvalescalarangonumerico();
        $DatEvalescalarangonumerico = $objDatEvalescalarangonumerico->findByIdescala($idescala);
        $flag = $DatEvalescalarangonumerico->toArray();
        if ($flag) {
            //Caso en que ya exista
            $DatEvalescalarangonumerico->delete();
        }
        $objDatEvalescalarangonumerico->idescala = $idescala;
        $objDatEvalescalarangonumerico->valorinicial = $valorinicial;
        $objDatEvalescalarangonumerico->valorfinal = $valorfinal;
        $objDatEvalescalarangonumerico->paso = $paso;
        $objDatEvalescalarangonumerico->representacion = $representacion;
        $objDatEvalescalarangonumerico->precision = $precision;
        $i = 0;
        if(!empty($paso)) {
            for ($valorinicial; $valorinicial <= $valorfinal; $valorinicial += $paso) {
                $objDatEvalescalarangonumerico->NomEvalvaloresnumericos[$i++]->denom = $valorinicial;
            }
        }
        $objDatEvalescalarangonumerico->save();

        $r['success'] = true;
        echo(json_encode($r));
    }

//Devuelve los valores cualitativos para una escala dado su id
    function escalasvaloresporidescalaAction()
    {
        $idescala = $this->_request->getPost('idescala');
        $objEscalaCualitativa = new DatEvalescalavalorescualitativos();
        $r['datos'] = $objEscalaCualitativa->GetEscalaValoresPoridescala($idescala);
        echo(json_encode($r));
    }

    //Asocia un valor cualitativo a la escala seleccionada
    function asociarValorCualitativoAction()
    {
        $idvalorescualitativos = $this->_request->getPost('idvalorescualitativos');
        $idescala = $this->_request->getPost('idescala');
        $objDatEvalescalavalorescualitativosModel = new DatEvalescalavalorescualitativosModel();
        $objDatEvalescalavalorescualitativos = new DatEvalescalavalorescualitativos();
        $existe = $objDatEvalescalavalorescualitativos->exiteValorCualitativoInEscala($idvalorescualitativos, $idescala);

        if ($existe[0]) {
            $r->codMsg = 3;
            $r->mensaje = "La valor cualitativo que quiere adicionar ya existe.";
            echo(json_encode($r));
        } else {

            $objDatEvalescalavalorescualitativos->idescala = $idescala;
            $objDatEvalescalavalorescualitativos->idvalorescualitativos = $idvalorescualitativos;
            $objDatEvalescalavalorescualitativos->peso = $objDatEvalescalavalorescualitativos->cantValorCualitativoXEscala($idescala) + 1;
            $objDatEvalescalavalorescualitativosModel->Insertar($objDatEvalescalavalorescualitativos);

            $r->codMsg = 1;
            $r->mensaje = "El valor cualitativo ha sido adicionado satisfactoriamente.";
            echo(json_encode($r));
        }
    }

    function elimAsocValorCualitativoAction()
    {
        $idescalavalorescualitativos = $this->_request->getPost('idescalavalorescualitativos');
        $objDatEvalescalavalorescualitativos = new DatEvalescalavalorescualitativos();
        $objAux = $objDatEvalescalavalorescualitativos->obtenerEscalaValorCualitativo($idescalavalorescualitativos);
        $objDatEvalescalavalorescualitativosModel = new DatEvalescalavalorescualitativosModel();
        $objDatEvalescalavalorescualitativosModel->Eliminar($objAux);
        $r->codMsg = 1;
        $r->mensaje = "El valor cualitativo ha sido eliminado satisfactoriamente.";
        echo(json_encode($r));
    }

    function eliminarvalornumericoAction()
    {
        try {
            $arrid = Json_decode(stripslashes($this->_request->getPost('arrid')));
            $q = new Doctrine_Query ();
            $q->delete('NomEvalvaloresnumericos')
                ->from('NomEvalvaloresnumericos')
                ->whereIn('idvaloresnumericos', $arrid)
                ->execute();
            echo(json_encode($r->success = true));
        } catch (Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = true;
                echo(json_encode($r));
            } else {
                echo(json_encode($e->getMessage()));
            }
        }
    }

    function existenEscalasAction()
    {
        $objEscala = new DatEvalescala();
        $r = $objEscala->GetTodos();
        if ($r == "")
            $a = 1;
        else
            $a = 2;
        echo(json_encode($a));
    }

    function valoresnumericosAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objValoresN = new NomEvalvaloresnumericos();
        $r['datos'] = $objValoresN->GetPorLimite($limit, $start);
        $r['cantidad'] = $objValoresN->GetCantTotal();

        echo(json_encode($r));
    }

    function valoresRNSeleccionadoAction()
    {
        $idescala = $this->_request->getPost('idescala');
        $DatEvalescalarangonumerico = new DatEvalescalarangonumerico();
        $r['datos'] = $DatEvalescalarangonumerico->getValoresEscala($idescala);
        $r['cantidad'] = count($r['datos']);
        echo(json_encode($r));
    }

    function SincronizarImgBDconFicheroServer($idvaloresimagenes)
    {
        $host = Zend_Registry::get('config')->bd->plantillas->host;
        $user = Zend_Registry::get('config')->bd->plantillas->usuario;
        $pass = Zend_Registry::get('config')->bd->plantillas->password;
        $dbna = Zend_Registry::get('config')->bd->plantillas->bd;
        $link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");
        $consulta = pg_query($link, "select denom, extension from mod_evaluaciones.nom_evalvaloresimagenes where idvaloresimagenes={$idvaloresimagenes}");
        $arrayVal = array();
        while ($row = pg_fetch_assoc($consulta))
            $arrayVal[] = $row;
        $ext = $arrayVal[0]['extension'];
        $ffp = fopen("nomvalimgs/" . "{$idvaloresimagenes}" . "{$ext}", "wb");
        fclose($ffp);
        $imagen = pg_unescape_bytea($arrayVal[0]['denom']);
        file_put_contents("nomvalimgs/" . "{$idvaloresimagenes}" . "{$ext}", $imagen);
    }

    function cargarTodasImagenesAction()
    {
        $dirimgs = "../../../plantillas/nomvalimgs/";
        $dir = "nomvalimgs/";
        $images = array();
        $arrNombres = array();
        $archivo = '';
        //Obtengo un listado de los nombres de los ficheros de imagenes en el servidor
        if ($gestor = opendir($dir)) {
            while (false !== ($archivo = readdir($gestor))) {
                if ($archivo != "." && $archivo != "..")
                    if (!preg_match('/\.(jpg|jpeg|gif|png|bmp|JPG|JPEG|GIF|PNG|BMP)$/', $archivo))
                        continue;
                    else
                        $arrNombres[] = $archivo;
            }
        } else /* Debo lanzar una excepcion



            */
            die("Direccion incorrecta o  no existe la carpeta nomvalimgs.");

        //Consulto la BD, buscando las imagenes que me piden
        $objVImg = new NomEvalvaloresimagenes();
        $images = $objVImg->GetPorLimite($this->_request->getPost('limit'), $this->_request->getPost('start'));
        $cantTotal = $objVImg->GetCantTotal();

        //Verifico que todas las imagenes guardadas en la BD, esten en el servidor como ficheros.
        $nomImg = "";
        $si = 1;
        foreach ($images as $i) {
            $nomImg = $i['idvaloresimagenes'] . $i['extension'];
            $si = -1;
            foreach ($arrNombres as $n)
                if ($nomImg == $n) {
                    $si = 1;
                    continue;
                } else {
                    $si = -1;
                }
            //En caso de que no este el fichero en el servidor lo creo y copio el contenido de la bd en el mismo.
            if ($si != 1)
                $this->SincronizarImgBDconFicheroServer($i['idvaloresimagenes']);
        }

        $o = array('datos' => $images, 'cantidad' => $cantTotal);

        echo json_encode($o);
    }

    function cargarValoresEscalaImgAction()
    {
        $idescala = $this->_request->getPost('idescala');
        $objEscala = new DatEvalescala();
        $arrValoresEscala['datos'] = $objEscala->GetValoresPorEscala($idescala);
        $arrValoresEscala['cantidad'] = count($arrValoresEscala['datos']);
        echo(json_encode($arrValoresEscala));
    }

    function guardarValoresEscalaImgAction()
    {
        $arrAux = Json_decode(stripslashes($this->_request->getPost('arrayVal')));
        $objDatEvalescalavaloresimagenModel = new DatEvalescalavaloresimagenModel();
        $i = 1;
        foreach ($arrAux as $valImg) {
            $objDatEvalescalavaloresimagen = new DatEvalescalavaloresimagen();
            $objDatEvalescalavaloresimagen->idvaloresimagenes = $valImg[0];
            $objDatEvalescalavaloresimagen->idescala = $valImg[1];
            $objDatEvalescalavaloresimagen->peso = $i;
            $i++;
            $objDatEvalescalavaloresimagenModel->Insertar($objDatEvalescalavaloresimagen);
        }
        $r->codMsg = 1;
        $r->mensaje = "La imagen ha sido guardada satisfactoriamente."; //$r->i = $i;
        echo(json_encode($r));
    }

    function asociarValorImagenAction()
    {
        $idvaloresimagenes = $this->_request->getPost('idvaloresimagenes');
        $idescala = $this->_request->getPost('idescala');
        $objDatEvalescalavaloresimagenModel = new DatEvalescalavaloresimagenModel();
        $objDatEvalescalavaloresimagen = new DatEvalescalavaloresimagen();
        $existe = $objDatEvalescalavaloresimagen->exiteImagenInEscala($idvaloresimagenes, $idescala);

        if ($existe[0]) {
            $r->codMsg = 3;
            $r->mensaje = "La imagen que quiere adicionar ya existe.";
            echo(json_encode($r));
        } else {
            $objDatEvalescalavaloresimagen->idescala = $idescala;
            $objDatEvalescalavaloresimagen->idvaloresimagenes = $idvaloresimagenes;
            $objDatEvalescalavaloresimagen->orden = $objDatEvalescalavaloresimagen->cantValorImagenXEscala($idescala) + 1;
            $objDatEvalescalavaloresimagenModel->Insertar($objDatEvalescalavaloresimagen);

            $r->codMsg = 1;
            $r->mensaje = "La imagen ha sido adicionada satisfactoriamente.";
            echo(json_encode($r));
        }
    }

    function elimAsocValorImagenAction()
    {
        $idevalescalavaloreimagene = $this->_request->getPost('idevalescalavaloreimagene');
        $idevalescalavaloreimagene = $this->_request->getPost('idevalescalavaloreimagene');
        $objDatEvalescalavaloresimagen = new DatEvalescalavaloresimagen();
        $objAux = $objDatEvalescalavaloresimagen->obtenerEscalaValorImagen($idevalescalavaloreimagene);
        $objDatEvalescalavaloresimagenModel = new DatEvalescalavaloresimagenModel();
        $objDatEvalescalavaloresimagenModel->Eliminar($objAux);
        $r->codMsg = 1;
        $r->mensaje = "La imagen ha sido eliminada satisfactoriamente.";
        echo(json_encode($r));
    }

    function actualizarordenvalorescualitativosAction()
    {
        $arrAux = Json_decode(stripslashes($this->_request->getPost('arrayVal')));
        $objDatEvalescalavalorescualitativosModel = new DatEvalescalavalorescualitativosModel();
        foreach ($arrAux as $v) {
            $objDatEvalescalavalorescualitativos = Doctrine::getTable('DatEvalescalavalorescualitativos')->find($v->idescalavalorescualitativos);
            $objDatEvalescalavalorescualitativos->peso = $v->orden;
            $objDatEvalescalavalorescualitativos->color = $v->color;
            $objDatEvalescalavalorescualitativosModel->Actualizar($objDatEvalescalavalorescualitativos);
        }
        echo(json_encode($r->succes = true));
    }

    function actualizarordenvaloresimagenesAction()
    {
        $arrAux = Json_decode(stripslashes($this->_request->getPost('arrayVal')));
        $objDatEvalescalavaloresimagenModel = new DatEvalescalavaloresimagenModel();
        foreach ($arrAux as $v) {
            $objDatEvalescalavaloresimagen = Doctrine::getTable('DatEvalescalavaloresimagen')->find($v->idevalescalavaloreimagene);
            $objDatEvalescalavaloresimagen->peso = $v->peso;
            $objDatEvalescalavaloresimagenModel->Actualizar($objDatEvalescalavaloresimagen);
        }
        echo(json_encode($r->succes = true));
    }

}
