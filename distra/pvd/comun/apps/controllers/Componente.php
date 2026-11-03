<?php

/**
 * Controlador para gestionar los tipos de certificaciones.
 *
 * @author Tte. Darien.
 * @package Presentación.
 * @subpackage ComponentesBase.
 * @category .
 * @uses
 * @copyright UCID
 * @version 1.0
 */
class Componente
{
    /**
     * @var
     */
    private $nombre;
    /**
     * @var
     */
    private $modulo;
    /**
     * @var
     */
    private $objetoEstructura;
    /**
     * @var array
     */
    private $archivosRequeridos = array();
    /**
     * @var array
     */
    private $moduloUtiliza = array();

    /**
     * @param $nombreModulo
     * @param $nombreComponente
     * @param $arrayConfig
     */
    function __construct($nombreModulo, $nombreComponente, $arrayConfig)
    {
        $this->nombre = $nombreComponente;
        $this->modulo = $nombreModulo;
        $this->objetoEstructura = $arrayConfig['estructura'];
        $this->idiomaUsuario = $arrayConfig ['idiomaUsuario'];

        $this->insertarModuloUtiliza();
        $this->estructurarArchivosRequeridos();
    }

    //return array
    /**
     * @return array
     */
    public function getModulosUtiliza()
    {
        return $this->moduloUtiliza;
    }

    //return void
    /**
     *
     */
    private function insertarModuloUtiliza()
    {
        $dirModulo = $this->objetoEstructura->getDireccionModulo($this->modulo);
        $moduloUtiliz = array($this->modulo => $dirModulo);
        $this->moduloUtiliza = array_merge($this->moduloUtiliza, $moduloUtiliz);
    }

    //return array.
    /**
     * @return array
     */
    public function getArchivosRequeridos()
    {
        return $this->archivosRequeridos;
    }

    //void
    /**
     *
     */
    private function estructurarArchivosRequeridos()
    {
        if ($this->contieneTipoElemento('required')) $this->insertarDependencias();
        if ($this->contieneTipoElemento('css')) $this->insertarTodosArchivosByTipoElem('css');
        if ($this->contieneTipoElemento('idioma')) $this->insertarTodosArchivosByTipoElem('idioma');
        if ($this->contieneTipoElemento('js')) $this->insertarTodosArchivosByTipoElem('js');
        if ($this->contieneTipoElemento('service')) $this->insertarTodosArchivosByTipoElem('service');
    }

    //return void
    /**
     *
     */
    private function insertarDependencias()
    {
        $estructuraDep = $this->objetoEstructura->getElementoComponenteByTipoElem($this->modulo, $this->nombre, 'required');
        if (gettype($estructuraDep[0]) == 'array') {
            foreach ($estructuraDep as $key => $value)
                $this->insertarArchivosCompYModuloUtilizaDependiente($value);
        } else {
            $this->insertarArchivosCompYModuloUtilizaDependiente($estructuraDep);
        }
    }

    //return void
    /**
     * @param $componenteDatos
     */
    private function insertarArchivosCompYModuloUtilizaDependiente($componenteDatos)
    {
        $objCompDepend = new Componente($componenteDatos['module'], $componenteDatos['component'], array("estructura" => $this->objetoEstructura,
                "idiomaUsuario" => $this->idiomaUsuario)
        );
        $this->archivosRequeridos = array_merge($this->archivosRequeridos, $objCompDepend->getArchivosRequeridos());
        $this->moduloUtiliza = array_merge($this->moduloUtiliza, $objCompDepend->getModulosUtiliza());
    }

    //return boolean
    /**
     * @param $tipoElem
     * @return bool
     */
    private function contieneTipoElemento($tipoElem)
    {
        return ($this->objetoEstructura->getElementoComponenteByTipoElem($this->modulo, $this->nombre, $tipoElem)) ? true : false;
    }

    //return void
    /**
     * @param $tipoElem
     */
    private function insertarTodosArchivosByTipoElem($tipoElem)
    {
        $estructuraElem = $this->objetoEstructura->getElementoComponenteByTipoElem($this->modulo, $this->nombre, $tipoElem);
        if (gettype($estructuraElem) == 'array') {
            foreach ($estructuraElem as $key => $value)
                $this->insertarArchivoIndexNumerado($tipoElem, $value, $key);
        } else {
            $this->insertarArchivo($tipoElem, $estructuraElem);
        }
    }

    //return void
    /**
     * @param $tipoElem
     * @param $dirArchivo
     */
    private function insertarArchivo($tipoElem, $dirArchivo)
    {
        $indice = $this->getIndexArchivo($tipoElem);
        $this->archivosRequeridos[$indice] = $this->getValueArchivo($tipoElem, $dirArchivo);
    }

    //return void
    /**
     * @param $tipoElem
     * @param $dirArchivo
     * @param $numero
     */
    private function insertarArchivoIndexNumerado($tipoElem, $dirArchivo, $numero)
    {
        $indice = $this->getIndexNumeradoArchivo($tipoElem, $numero);
        $this->archivosRequeridos[$indice] = $this->getValueArchivo($tipoElem, $dirArchivo);
    }

    //string
    /**
     * @param $tipoElem
     * @param $numero
     * @return string
     */
    private function getIndexNumeradoArchivo($tipoElem, $numero)
    {
        return $this->getIndexArchivo($tipoElem) . '_' . $numero;
    }

    //string
    /**
     * @param $tipoElem
     * @return string
     */
    private function getIndexArchivo($tipoElem)
    {
        return $this->modulo . '_' . $this->nombre . '_' . $tipoElem;
    }

    //array
    /**
     * @param $tipoElem
     * @param $dirArchivo
     * @return array
     */
    private function getValueArchivo($tipoElem, $dirArchivo)
    {
        $dirModulo = $this->objetoEstructura->getDireccionModulo($this->modulo);
        if ($tipoElem == 'idioma')
            return $this->getValueArchivoIdioma($dirArchivo, $dirModulo);
        else
            return array($tipoElem, $dirModulo . $dirArchivo);
    }

    //retunr array
    /**
     * @param $dirArchivo
     * @param $dirModulo
     * @return array
     */
    public function getValueArchivoIdioma($dirArchivo, $dirModulo)
    {
        $dirFinalArchivo = str_replace('/{idioma}/', '/' . $this->idiomaUsuario . '/', $dirArchivo);
        return array('js', $dirModulo . $dirFinalArchivo);
    }

}
