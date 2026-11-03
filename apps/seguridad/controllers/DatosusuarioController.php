<?php

/**
 * @name DatosusuarioController - Clase controladora para 
 * gestionar campos dinámicos usados en el perfil del usuario.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class DatosusuarioController extends ZendExt_Controller_Secure
{

    /**
     * @name init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @name datosusuarioAction() - Función principal de la clase, 
     * encargada de renderiar la vista correspondiente.
     * @return void
     */
    public function datosusuarioAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method insertarcampoAction -Función usada 
     * para adicionar un nuevo campo.
     */
    public function insertarcampoAction()
    {
        $campo = new NomCampo();
        $campo->tipo = $this->_request->getPost('tipo');
        $campo->nombre = $this->_request->getPost('nombre');
        $campo->nombreamostrar = $this->_request->getPost('alias');
        $campo->longitud = $this->_request->getPost('longitud');
        $campo->visible = $this->_request->getPost('visible');
        $campo->idexpresion = $this->_request->getPost('idexpresiones');
        $campo->descripcion = $this->_request->getPost('descripcion');
        $campo->tipocampo = $this->_request->getPost('tipocampo');
        if (self::verificarCampos('nombre', $campo->nombre, null) > 0) {
            throw new ZendExt_Exception('SEGCAMPO01');
        }
        if (self::verificarCampos(
            'nombreamostrar', $campo->nombreamostrar, null
        ) > 0) {
            throw new ZendExt_Exception('SEGCAMPO02');
        }
        $model = new NomCampoModel();
        $model->insertarcampo($campo);
        $this->showMessage('El campo ha sido adicionado satisfactoriamente.');
    }

    /**
     * @method modificarcampoAction - Función usada 
     * para modificar el campo seleccionado.
     */
    public function modificarcampoAction()
    {
        $campo = new NomCampo();
        $idcampo = $this->_request->getPost('idcampo');
        $nombre = $this->_request->getPost('nombre');
        $nombreMostrar = $this->_request->getPost('alias');
        $campo = Doctrine::getTable('NomCampo')->find($idcampo);
        $campo->tipo = $this->_request->getPost('tipo');
        $campo->longitud = $this->_request->getPost('longitud');
        $campo->visible = $this->_request->getPost('visible');
        $campo->idexpresion = $this->_request->getPost('idexpresiones');
        $campo->descripcion = $this->_request->getPost('descripcion');
        $campo->tipocampo = $this->_request->getPost('tipocampo');
        if ($campo->nombre != $nombre) {
            if (self::verificarCampos('nombre', $nombre, $idcampo) > 0) {
                throw new ZendExt_Exception('SEGCAMPO01');
            }
        }
        if ($campo->nombreamostrar != $nombreMostrar) {
            if (self::verificarCampos(
                'nombreamostrar', $nombreMostrar, $idcampo
            ) > 0) {
                throw new ZendExt_Exception('SEGCAMPO02');
            }
        }
        $campo->nombre = $nombre;
        $campo->nombreamostrar = $nombreMostrar;
        $model = new NomCampoModel();
        $model->modificarcampo($campo);
        $this->showMessage('El campo ha sido modificado satisfactoriamente.');
    }

    /**
     * @method eliminarcampoAction - Función usada 
     * para eliminar el campo seleccionado.
     */
    public function eliminarcampoAction()
    {
        $idcampo = $this->_request->getPost('idcampo');
        if (NomCampo::verificarCampoEliminar($idcampo) > 0) {
            throw new ZendExt_Exception('SEGCAMPO03');
        }
        $campo = new NomCampo();
        $campo = Doctrine::getTable('NomCampo')->find($idcampo);
        $model = new NomCampoModel();
        $model->eliminarcampo($campo);
        $this->showMessage('El campo ha sido eliminado satisfactoriamente.');
    }

    /**
     * @method cargarcamposAction - Función usada para
     *  cargar el listado de campos por lotes.
     */
    public function cargarcamposAction()
    {
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $datosacc = NomCampo::cargarcampo($limit, $start);
        $filas = NomCampo::obtenercantcampos();
        $campos = array();
        foreach ($datosacc as $index => $user) {
            $campos[$index]['idcampo'] = $user['idcampo'];
            $campos[$index]['tipo'] = $user['tipo'];
            $campos[$index]['nombre'] = $user['nombre'];
            $campos[$index]['nombreamostrar'] = $user['nombreamostrar'];
            $campos[$index]['longitud'] = $user['longitud'];
            $campos[$index]['visible'] = $user['visible'];
            $campos[$index]['idexpresiones'] = $user['idexpresion'];
            $campos[$index]['tipocampo'] = $user['tipocampo'];
            $campos[$index]['descripcion'] = $user['descripcion'];
            $campos[$index]['expresion'] = $user['NomExpresiones']['expresion'];
            $campos[$index]['denominacion'] = 
                $user['NomExpresiones']['denominacion'];
        }
        echo json_encode(
            array('cantidad de filas' => $filas, 'datos' => $campos)
        );
    }

    private function verificarCampos($campo, $valor, $idcampo)
    {
        return NomCampo::comprobarCampo($campo, $valor, $idcampo);
    }
}