<?php

class EnlacesStaticosService
{
    protected $response;

    protected $staticlink;

    function __construct()
    {
        $dirwww = $_SERVER['DOCUMENT_ROOT'];
        $modulo_path = str_replace('web', 'apps', $dirwww) . '/pvd/persona/comun/recursos/json/' . 'staticlink.json';
        if (file_exists($modulo_path)) {
            if (is_readable($modulo_path)) {
                $this->staticlink = json_decode(file_get_contents($modulo_path));
            }
        }
    }

    /**
     * Funcion para obtener el identificador del correo electronico
     *
     * @return int
     */
    public function getCorreoElectronico()
    {
        return ($this->staticlink->correo_electronico) ? $this->staticlink->correo_electronico : null;
    }

    public function getTelefono()
    {
        return ($this->staticlink->telefono) ? $this->staticlink->telefono : null;
    }

    /**
     * Funcion para obtener los tipos de categorias de la persona que no son de corte docente ni cientificas
     *
     * @return array
     */
    public function getTipoCategorias()
    {
        return ($this->staticlink->tiposcategorias) ? $this->staticlink->tiposcategorias : array();
    }

    public function getTipoCategoriasCientificas()
    {
        return ($this->staticlink->tipocategorias_cientificas) ? $this->staticlink->tipocategorias_cientificas : array();
    }

    public function getImgSexo()
    {
        return ($this->staticlink->img_sexo) ? $this->staticlink->img_sexo : array();
    }

    public function getIdJudiciales()
    {
        return ($this->staticlink->sancion_judicial) ? $this->staticlink->sancion_judicial : array();
    }
}