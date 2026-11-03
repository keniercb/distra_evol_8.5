<?php

/**
 * Controlador para calcular tareas *
 *
 * @author
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmplistachequeoController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase
     */
    function init() {
        parent::init();


    }

        /**
         * Accion para mostrar la vista checklist.phtml
         */
        function cmplistachequeoAction() {
                 $this->render();
        }






}
