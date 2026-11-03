<?php

/**
 * @name DominioValidator - Clase de validación de Dominios.
 * @package seguridad.
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0-0
 */
class DominioValidator
{

    public function verificarNombreDominio()
    {
        $iddominio = (isset($_POST['iddominio'])) ? $_POST['iddominio'] : 0;
        $integrator = ZendExt_IoC::getInstance();
        if ($integrator->metadatos->existeNombreDominio(
            $_POST['denominacion'], $iddominio
        ) > 0)
            return false;
        return true;
    }

    /**
     * Función encargada de validar que el dominio tenga chequeada al
     *  menos una entidad.
     * @method verificarEstructurasDominio
     * @return TRUE | ZendExt_Exception Verdadero en caso de no cumplirse 
     * las reglas de lo contrario lanza una excepción personalizada.
     */
    public function verificarEstructurasDominio()
    {
        $arrayEntidadesEliminar = json_decode(
            stripslashes($_POST['arrayEntidadesEliminar'])
        );
        if (count($arrayEntidadesEliminar) > 0) {
            $integrator = ZendExt_IoC::getInstance();
            if ($integrator->metadatos->existeEstructura(
                $_POST['iddominio']
            ) == 0)
                throw new ZendExt_Exception('SEGDOM05');
        }
        return true;
    }

}