<?php

/**
 * @name GestperfilController - lase controladora de Perfil de usuario.
 * @package   seguridad
 * @copyright UCID.
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestperfilController extends ZendExt_Controller_Secure
{

    /**
     * @method init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @method gestperfilAction() - Función principal de la clase, 
     * encargada de renderiar la vista correspondiente.
     * @return void
     */
    public function gestperfilAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method insertarperfilAction - Función usada para adicionarle 
     * datos al perfil de usuario.
     */
    public function insertarperfilAction()
    {
        $campos = NomCampo::cargarcampo(0, 0);
        $arrayCampos = $campos;
        $objFila = new NomFila();
        $objFila->idusuario = $this->_request->getPost('idusuario');
        $objFila->save();
        foreach ($arrayCampos as $campo) {
            $objValor = new NomValor();
            $objValor->valor = $this->_request->getPost($campo['nombre']);
            $objValor->idcampo = $campo['idcampo'];
            $objValor->idfila = $objFila->idfila;
            $result[] = $objValor;
        }
        $model = new SegUsuarioModel();
        $model->insertarperfil($result);
        $this->showMessage('El perfil ha sido adicionado satisfactoriamente.');
    }

    /**
     * @method modificarperfilAction - Función usada para modificar 
     * el perfil del usuario seleccionado.
     */
    public function modificarperfilAction()
    {
        $campos = NomCampo::cargarcampo(0, 0);
        $idfila = $this->_request->getPost('idfila');
        $arrayCampos = $campos;
        $cantvaloresfila = NomValor::cantvaloresdadofila($idfila);
        $k = 0;
        $resultAdicionar = array();
        $resultModificar = array();
        $resultEliminar = array();
        foreach ($arrayCampos as $campo) {
            $idcampo = $campo['idcampo'];
            $valor = NomValor::cargaridvalor($idfila, $idcampo);
            $objNomValor = Doctrine::getTable('NomValor')->find(
                $valor[0]['idvalor']
            );
            if ($objNomValor) {
                if ($this->_request->getPost($campo['nombre'])) {
                    $objNomValor->valor = $this->_request->getPost(
                        $campo['nombre']
                    );
                    $resultModificar[] = $objNomValor;
                } else {
                    $cantvaloresfila--;
                    $resultEliminar[] = $objNomValor;
                }
                unset($objNomValor);
            } else {
                $objValor = new NomValor();
                $objValor->idvalor = $objValor->genId() + $k;
                $objValor->valor = $this->_request->getPost($campo['nombre']);
                $objValor->idcampo = $campo['idcampo'];
                $objValor->idfila = $idfila;
                $resultAdicionar[] = $objValor;
                $k++;
            }
        }
        $model = new SegUsuarioModel();
        if ($cantvaloresfila != 0) {
            $model->modificarperfil(
                $resultModificar, $resultEliminar, $resultAdicionar
            );
        } else {
            NomFila::eliminarfila($idfila);
        }
        $this->showMessage('El perfil ha sido modificado satisfactoriamente.');
    }

    /**
     * @method configurargridAction - Función usada para 
     * crear dinamicamente las columnas del grid.
     */
    public function configurargridAction()
    {
        $arregloResult = NomCampo::cargarcampo(0, 0);
        $columna[] = array(
            'hidden' => true, 
            'hideable' => false, 
            'dataIndex' => 'idusuario'
        );
        $columna[] = array(
            'hidden' => true, 'hideable' => false,
            'dataIndex' => 'idfila'
        );
        $columna[] = array(
            'id'        => 'expandir', 
            'header' => 'Usuario', 
            'width' => 200,
            'dataIndex' => 'nombreusuario', 
            'sortable' => true
        );
        $campoStore[] = array('name' => 'idusuario', 'mapping' => 'idusuario');
        $campoStore[] = array('name' => 'idfila', 'mapping' => 'idfila');
        $campoStore[] = array(
            'name' => 'nombreusuario', 
            'mapping' => 'nombreusuario'
        );
        foreach ($arregloResult as $campo) {
            $campoStore[] = array(
                'name' => $campo['nombre'], 
                'mapping' => $campo['nombre']
            );
            $columna[] = array(
                'header'   => $campo['nombreamostrar'], 
                'width' => 100, 
                'dataIndex' => $campo['nombre'],
                'sortable' => true
            );
        }
        $parteStore = array('store' => $campoStore);
        $parteColumna = array('columns' => $columna);
        echo json_encode(array($parteColumna, $parteStore));
    }

    /**
     * @method cargargridAction - Función usada para cargar el 
     * grid de usuarios compartimentados.
     */
    public function cargargridAction()
    {
        $nombreusuario = ($this->_request->getPost('nombreusuario')) 
            ? $this->_request->getPost('nombreusuario') : '';
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $iddominio = $this->global->Perfil->iddominio;
        $idusuario = $this->global->Perfil->idusuario;
        $result = array();
        $cont=0;
        $campos = NomCampo::gridUsuarioDominio(
            $nombreusuario, $idusuario, $iddominio, $limit, $start
        );        
        foreach ($campos as $valor) {           
            $indice = $this->existeYa($result, $valor['idusuario']);            
            if ($indice === false) { 
                $result[$cont]['idusuario'] = $valor['idusuario'];
                $result[$cont]['nombreusuario'] = $valor['nombreusuario']; 
                if ($valor['idvalor']!=null) {
                $result[$cont]['idfila'] = $valor['idfila'];
                $arrayvalores = NomValor::cargarcamposdadovalores(
                    $valor['idvalor']
                );                
                $result[$cont][$arrayvalores[0]['NomCampo']['nombre']] = 
                    $valor['valor']; 
                }
            } else {                
                $arrayvalores = NomValor::cargarcamposdadovalores(
                    $valor['idvalor']
                );
                $result[$indice][$arrayvalores[0]['NomCampo']['nombre']] = 
                    $valor['valor'];
                $cont--;
            }
            $cont++;
        }         
        $cantFila = count($result);
        echo json_encode(array('cant_fila' => $cantFila, 'datos' => $result));
    }

    /**
     * @method cargarcamposAction - Función usada para cargar los campos.
     */
    public function cargarcamposAction()
    {
        $campos = NomCampo::cargarcampo(0, 0);
        $result = array('cantidad' => count($campos), 'campos' => $campos);
        echo json_encode($result);
    }

    private function existeYa($result, $idusuario)
    {
        $k = 0;
        foreach ($result as $valor) {
            if ($valor['idusuario'] == $idusuario) {
                return $k;
            }
            $k++;
        }

        return false;
    }

}