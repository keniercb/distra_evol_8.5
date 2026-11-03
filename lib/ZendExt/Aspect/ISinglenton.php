<?php
interface ZendExt_Aspect_ISinglenton
{
    /**
     * getInstance
     *
     * Obtencion de la instancia de la clase, ya que esta no puede ser instanciada
     * directamente debido a que es un singlenton
     *
     * @return ZendExt_Aspect_Validation - instancia de la clase
     */
    static public function getInstance();
}
