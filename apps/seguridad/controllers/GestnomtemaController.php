<?php

/**
 * @name GestnomtemaController - Clase controladora del nomenclador de temas.
 * @package   seguridad
 * @copyright UCID.
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestnomtemaController extends ZendExt_Controller_Secure
{

    /**
     * @method init() - Constructor de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * @method gestnomtemaAction() - Función principal de la clase, 
     * encargada de renderiar la vista correspondiente.
     * @return void
     */
    public function gestnomtemaAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method insertartemaAction - Función usada para insertar un nuevo tema.
     */
    public function insertartemaAction()
    {
        $tema = new NomTema();
        $tema->denominacion = $this->_request->getPost('denomTema');
        $tema->abreviatura = $this->_request->getPost('abrevTema');
        $tema->descripcion = $this->_request->getPost('descripTema');
        if (self::verificartema(
            'denominacion', $tema->denominacion, null
        ) > 0) {
            throw new ZendExt_Exception('SEG016');
        }
        if (self::verificartema('abreviatura', $tema->abreviatura, null) > 0) {
            throw new ZendExt_Exception('SEGTEMA01');
        } else {
            $modeltema = new NomTemaModel();
            $modeltema->insertartema($tema);
            echo "{'cod':1,'mensaje': 'El tema ha sido "
            . "adicionado satisfactoriamente.'}";
        }
    }

    /**
     * @method modificartemaAction - Función usada para modificar 
     * un tema seleccionado.
     */
    public function modificartemaAction()
    {
        $tema = new NomTema();
        $denominacion = $this->_request->getPost('denomTema');
        $abreviatura = $this->_request->getPost('abrevTema');
        $idtema = $this->_request->getPost('idtema');
        $tema = Doctrine::getTable('NomTema')->find($idtema);
        $tema->descripcion = $this->_request->getPost('descripTema');
        if ($tema->denominacion != $denominacion) {
            if (self::verificartema(
                'denominacion', $denominacion, $idtema
            ) > 0) {
                throw new ZendExt_Exception('SEG016');
            }
        }
        if ($tema->abreviatura != $abreviatura) {
            if (self::verificartema('abreviatura', $abreviatura, $idtema) > 0) {
                throw new ZendExt_Exception('SEGTEMA01');
            }
        }
        $tema->denominacion = $denominacion;
        $tema->abreviatura = $abreviatura;
        $modeltema = new NomTemaModel();
        $modeltema->modificartema($tema);
        echo "{'cod':1,'mensaje': 'El tema ha sido modificado "
        . "satisfactoriamente.'}";
    }

    /**
     * @method eliminarnomtemaAction - Función usada 
     * para eliminar un tema seleccionado.
     */
    public function eliminarnomtemaAction()
    {
        $modeltema = new NomTemaModel();
        $idtema = $this->_request->getPost('idtema');
        if (!SegUsuario::verificarTema($idtema)) {
            $tema = Doctrine::getTable('NomTema')->find($idtema);
            $modeltema->eliminartema($tema);
            echo "{'cod':1,'mensaje': 'El tema ha sido "
            . "eliminado satisfactoriamente.'}";
        } else {
            throw new ZendExt_Exception('SEGTEMA03');
        }
    }

    /**
     * @method cargarnomtemaAction - Función usada para 
     * listar los temas por lotes.
     */
    public function cargarnomtemaAction()
    {
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        if ($limit > 0) {
            $datostema = NomTema::cargarnomtema($limit, $start);
            $canfilas = NomTema::obtenercantnomtema();
            $datos = $datostema->toArray();
            $result = array('cantidad_filas' => $canfilas, 'datos' => $datos);
        } else {
            $combotema = NomTema::cargarcombotema();
            $result = $combotema->toArray();
        }
        echo json_encode($result);
    }

    private static function verificartema($campo, $valor, $idtema)
    {
        return NomTema::comprobartema($campo, $valor, $idtema);
    }

}
