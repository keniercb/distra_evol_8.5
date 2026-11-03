<?php

/**
 * Clase controladora de Acciones perteneciente al componente de autorización.
 *
 * @name GestexpresionesController - Clase controladora.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestexpresionesController extends ZendExt_Controller_Secure
{

    /**
     * @name init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @name gestaccionAction() - Función principal de la clase, 
     * encargada de renderiar la vista correspondiente.
     * @return void
     */
    public function gestexpresionesAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method insertarexpresionAction - Función usada para adicionar 
     * una nueva expresión regular.
     */
    public function insertarexpresionAction()
    {
        $expresion = new NomExpresiones();
        $expresion->denominacion = $this->_request->getPost('denominacionexp');
        $expresion->expresion = $this->_request->getPost('expresion');
        $expresion->descripcion = $this->_request->getPost('descripcionexp');
        if (self::verificarExpresion(
            'denominacion', $expresion->denominacion, null
        ) > 0) {
            throw new ZendExt_Exception('SEGEXPRS01');
        }
        if (self::verificarExpresion(
            'expresion', $expresion->expresion, null
        ) > 0) {
            throw new ZendExt_Exception('SEGEXPRS02');
        } else {
            $model = new NomExpresionesModel();
            $model->insertarexpresion($expresion);
            $this->showMessage(
                'La expresi&oacute;n ha sido adicionada satisfactoriamente.'
            );
        }
    }

    /**
     * @method modificarexpresionAction - Función usada para 
     * modificar una expresión regular.
     */
    public function modificarexpresionAction()
    {
        $idexpresion = $this->_request->getPost('idexpresiones');
        $expresion = new NomExpresiones();
        $expresion = Doctrine::getTable('NomExpresiones')->find($idexpresion);
        $denominacion = $this->_request->getPost('denominacionexp');
        $expresionRegular = $this->_request->getPost('expresion');
        $expresion->descripcion = $this->_request->getPost('descripcionexp');
        if ($expresion->denominacion != $denominacion) {
            if (self::verificarExpresion(
                'denominacion', $denominacion, $idexpresion
            ) > 0) {
                throw new ZendExt_Exception('SEGEXPRS01');
            }
        }
        if ($expresion->expresion != $expresionRegular) {
            if (self::verificarExpresion(
                'expresion', $expresionRegular, $idexpresion
            ) > 0) {
                throw new ZendExt_Exception('SEGEXPRS02');
            }
        }
        $expresion->denominacion = $denominacion;
        $expresion->expresion = $expresionRegular;
        $model = new NomExpresionesModel();
        $model->modificarexpresion($expresion);
        $this->showMessage(
            'La expresi&oacute;n ha sido modificada satisfactoriamente.'
        );
    }

    /**
     * @method eliminarexpresionAction - Función usada para 
     * eliminar una colección de acciones.
     */
    public function eliminarexpresionAction()
    {
        $arrayExpresionesElim = json_decode(
            stripslashes($this->_request->getPost('expresionesElim'))
        );
        $arrayElim = array();
        foreach ($arrayExpresionesElim as $idexpresion) {
            if (NomValor::verificarExpresion($idexpresion) == 0) {
                $arrayElim[] = $idexpresion;
            }
        }
        if (count($arrayExpresionesElim) == count($arrayElim)) {
            NomExpresiones::eliminarExpresiones($arrayElim);
            $this->showMessage(
                'La expresi&oacute;n ha sido eliminada satisfactoriamente.'
            );
        } elseif (count($arrayElim) > 0) {
            NomExpresiones::eliminarExpresiones($arrayElim);
            $this->showMessage(
                'La expresi&oacute;n(es) seleccionada no se puede '
                . 'eliminar debido a que est&aacute; en uso.'
            );
        }
    }

    /**
     * @method cargarexpresionesAction - Función usada para listar 
     * las expresiones regulares registradas por lotes.
     */
    public function cargarexpresionesAction()
    {
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $buscar = $this->_request->getPost("buscar");
        if ($buscar) {
            $datosacc = NomExpresiones::cargarexpresionBuscar(
                $buscar, $limit, $start
            );
            $canfilas = NomExpresiones::obtenerexpresionBuscar($buscar);
        } else {
            $datosacc = NomExpresiones::cargarexpresion($limit, $start);
            $canfilas = NomExpresiones::obtenerexpresion();
        }
        echo json_encode(
            array(
                'cantidad_filas' => $canfilas, 
                'datos' => $datosacc->toArray()
            )
        );
    }

    private static function verificarExpresion($campo, $valor, $idexpresion)
    {
        return NomExpresiones::verificarExpresion($campo, $valor, $idexpresion);
    }

}