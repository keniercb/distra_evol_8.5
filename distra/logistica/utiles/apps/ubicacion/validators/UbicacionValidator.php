<?php

/* Esta clase controla todas validaciones
 * @copyright Xetid
 * @author División Gestión de Entidades
 * @versión 1.0
 */

class UbicacionValidator
{

    public $post = array();
    private $objHelper, $global;

    public function UbicacionValidator()
    {
        $this->post = $_POST;
        $this->objHelper = LogisticaObjectHelper::__init();
        $this->global = ZendExt_GlobalConcept::getInstance();
    }

    /**
     * Método para validar la capacidad de los productos  en la estructura de la ubicación
     *
     * @param type null
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function validarCapacidad()
    {
        $this->post['data'] = $this->objHelper->stdClassToArray(Zend_Json::decode($this->post['data']));
        $idestructura = $this->global->Estructura->idestructura;
        $idestructuraubicacion = $this->post['data']['idubicacion'];
        $cantidad = $this->post['data']['cantidad'];
        $regla = new Datconfigubicacion();
        $tipo = $regla->cargarDatos($idestructura);
        $estructura = new DatEstructuraubicacionModel();
        $parametros = $estructura->devolverParametrosUbicacion($idestructuraubicacion);
        if ($tipo['capacidad'] == 0 || $parametros[0]['capacidad'] == 0) {
            return true;
        }
        if ($tipo['estructura'] == 1 && $parametros == null) {
            return true;
        }
        if ($tipo['capacidad'] == 1 && $parametros[0]['capacidad'] == 1) {
            $capacidad = $estructura->dameCapacidad($idestructuraubicacion, $cantidad);
            if ($capacidad == 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Método para validar el volumen de los productos  en la estructura de la ubicación
     *
     * @param type null
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function validarVolumen()
    {
        $this->post['data'] = $this->objHelper->stdClassToArray(Zend_Json::decode($this->post['data']));
        $idestructura = $this->global->Estructura->idestructura;
        $idestructuraubicacion = $this->post['data']['idubicacion'];
        $regla = new Datconfigubicacion();
        $tipo = $regla->cargarDatos($idestructura);
        $estructura = new DatEstructuraubicacionModel();
        $parametros = $estructura->devolverParametrosUbicacion($idestructuraubicacion);
        if ($tipo['volumen'] == 0 || $parametros[0]['volumen'] == 0) {
            return true;
        }
        if ($tipo['estructura'] == 1 && $parametros[0] == null) {
            return true;
        }
        if ($tipo['volumen'] == 1 && $parametros[0]['volumen'] == 1) {
            $volumen = $estructura->dameVolumen(
                $idestructuraubicacion, $this->post['data']['cantidad'], $this->post['idproducto']
            );
            if ($volumen == 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Método para validar el peso de los productos en la estructura de ubicación
     *
     * @param type null
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function validarPeso()
    {
        $this->post['data'] = $this->objHelper->stdClassToArray(Zend_Json::decode($this->post['data']));
        $idestructura = $this->global->Estructura->idestructura;
        $idestructuraubicacion = $this->post['data']['idubicacion'];
        $idproducto = $this->post['idproducto'];
        $cantidad = $this->post['data']['cantidad'];
        $regla = new Datconfigubicacion();
        $tipo = $regla->cargarDatos($idestructura);
        $estructura = new DatEstructuraubicacionModel();
        $parametros = $estructura->devolverParametrosUbicacion($idestructuraubicacion);
        if ($tipo['peso'] == 0 || $parametros[0]['peso'] == 0) {
            return true;
        }
        if ($tipo['estructura'] == 1 && $parametros[0] == null) {
            return true;
        }
        if ($tipo['peso'] == 1 && $parametros[0]['peso'] == 1) {
            $peso = $estructura->damePeso($idestructuraubicacion, $cantidad, $idproducto);
            if ($peso == 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Método para validar la cantidad productos  en la estructura de la ubicación
     *
     * @param type null
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function validarCantidad()
    {
        $pIntegrator = ZendExt_IoC_Inter::getInstance();
        $parametros = new stdClass();
        $parametros->idubicacionproducto = $this->post['idubicacionproducto'];
        $parametros->idmovimiento = $this->post['idmovimiento'];
        $parametros->cantidad = $this->post['cantidad'];
        $parametros->idestructuraubicacion = $this->post['idestructuraubicacion'];
        $result = $pIntegrator->utilesLogistica->validcantidad($parametros);
        if ($result == 1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Método para validar el producto único en la estructura de la ubicación
     *
     * @param type null
     *
     * @author Yoandi Díaz Ramos
     * @return 1:0
     */
    public function validarProducto()
    {
        // print_r( $this->post['data']);die;
        $this->post['data'] = $this->objHelper->stdClassToArray(Zend_Json::decode($this->post['data']));
        $idestructura = $this->global->Estructura->idestructura;
        $idestructuraubicacion = $this->post['data']['idubicacion'];
        $idproducto = $this->post['idproducto'];
        $cantidad = $this->post['data']['cantidad'];
        $idindicador = $this->post['idindicador'];
        $regla = new Datconfigubicacion();
        $tipo = $regla->cargarDatos($idestructura);
        $estructura = new DatEstructuraubicacionModel();
        $parametros = $estructura->devolverParametrosUbicacion($idestructuraubicacion);
        if ($tipo['producto'] == 1 && $parametros[0]['productounico'] == 1) {
            $val = $estructura->validarProducto($idestructuraubicacion, $idindicador);
            if ($val != null) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    public function validarEliminarArea()
    {
        $idestructuraubicacion = $this->post['idestu'];
        $estructura = new DatEstructuraubicacionModel();
        $val = $estructura->verificarEliminarArea($idestructuraubicacion);
        if ($val == -1) {
            return false;
        }
        return true;
    }

    public function validarEliminarUbicacion()
    {
        $idestructuraubicacion = $this->post['idestu'];
        $estructura = new DatEstructuraubicacionModel();
        $val = $estructura->verificarEliminarUbicacion($idestructuraubicacion);
        if ($val == -1) {
            return false;
        }
        return true;
    }

}
