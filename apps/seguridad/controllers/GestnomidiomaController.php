<?php

/**
 * @name GestnomidiomaController - Clase controladora de nomenclador de idiomas.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestnomidiomaController extends ZendExt_Controller_Secure
{

    /**
     * @name init () - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @name gestnomidiomaAction () - Función principal de la clase, 
     * encargada de renderiar la vista correspondiente.
     * @return void
     */
    public function gestnomidiomaAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method insertarnomidiomaAction - Función usada
     *  para adicionar un nuevo idioma.
     */
    public function insertarnomidiomaAction()
    {
        $idioma = new NomIdioma();
        $idioma->denominacion = $this->_request->getPost('denomidioma');
        $idioma->abreviatura = $this->_request->getPost('abrevidioma');
        if (self::verificaridioma(
            'denominacion', $idioma->denominacion, null
        ) > 0) {
            throw new ZendExt_Exception('SEGIDIOMA02');
        } else {
            if (self::verificaridioma(
                'abreviatura', $idioma->abreviatura, null
            ) > 0) {
                throw new ZendExt_Exception('SEGIDIOMA03');
            } else {
                $modelidioma = new NomIdiomaModel();
                $modelidioma->insertaridioma($idioma);
                echo "{'cod':1,'mensaje': 'El idioma ha sido "
                . "adicionado satisfactoriamente.'}";
            }
        }
    }

    /**
     * @method modificarnomidiomaAction - Función usada para 
     * modificar el idioma seleccionado.
     */
    public function modificarnomidiomaAction()
    {
        $denominacion = $this->_request->getPost('denomidioma');
        $abreviatura = $this->_request->getPost('abrevidioma');
        $ididioma = $this->_request->getPost('ididioma');
        $idioma = new NomIdioma();
        $idioma = Doctrine::getTable('NomIdioma')->find($ididioma);
        if ($idioma->denominacion != $denominacion) {
            if (self::verificaridioma(
                'denominacion', $denominacion, $ididioma
            ) > 0) {
                throw new ZendExt_Exception('SEGIDIOMA02');
            }
        }
        if ($idioma->abreviatura != $abreviatura) {
            if (self::verificaridioma(
                'abreviatura', $abreviatura, $ididioma
            ) > 0) {
                throw new ZendExt_Exception('SEGIDIOMA03');
            }
        }
        $idioma->denominacion = $denominacion;
        $idioma->abreviatura = $abreviatura;
        $modelidioma = new NomIdiomaModel();
        $modelidioma->modificaridioma($idioma);
        echo "{'cod':1,'mensaje': 'El idioma ha sido "
        . "modificado satisfactoriamente.'}";
    }

    /**
     * @method eliminarnomidiomaAction - Función usada para 
     * eliminar el idioma seleccionado.
     */
    public function eliminarnomidiomaAction()
    {
        $idioma = $this->_request->getPost('ididioma');
        if (!SegUsuario::verificarIdioma($idioma)) {
            $modelidioma = new NomIdiomaModel();
            $idioma = Doctrine::getTable('NomIdioma')->find($idioma);
            $modelidioma->eliminaridioma($idioma);
            echo "{'cod':1,'mensaje': 'El idioma ha sido "
            . "eliminado satisfactoriamente.'}";
        } else {
            throw new ZendExt_Exception('SEGIDIOMA01');
        }
    }

    /**
     * @method cargarnomidiomaAction - Función usada para 
     * listar los idiomas por lotes.
     */
    public function cargarnomidiomaAction()
    {
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        if ($limit > 0) {
            $datosidioma = NomIdioma::cargarnomidioma($limit, $start);
            $canfilas = NomIdioma::obtenercantnomidioma();
            $datos = $datosidioma->toArray();
            $result = array('cantidad_filas' => $canfilas, 'datos' => $datos);
        } else {
            $comboidioma = NomIdioma::cargarcomboidioma();
            $result = $comboidioma->toArray();
        }
        echo json_encode($result);
    }

    private static function verificaridioma($campo, $valor, $ididioma)
    {
        return NomIdioma::comprobaridioma($campo, $valor, $ididioma);
    }

}

