<?php
class BusquedaValidator
{
    public $post;
    public $busqueda;

    function BusquedaValidator()
    {
        $this->post = $_POST;
        $this->busqueda = new DatBusquedaModel();
    }

    public function existeBusqueda()
    {
        $existe = $this->busqueda->existeBusqueda($this->post['denominacion']);
        if ($existe) {
            return false;
        }
        return true;
    }

}