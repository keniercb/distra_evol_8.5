<?php

class ZendExt_View_Helper {

    private $location;
    private $prefix;

    public function __construct() {
        $relativa="";
        while(!is_dir($relativa."web")){
            $relativa=$relativa."../";
        }
        $this->prefix=$relativa."web";
    }

    public function setLocation($location) {
        $this->location = $location;
        $this->prefix=  $this->prefix.$this->location;
        
    }

    public function getLocation() {
        return $this->location;
    }

    public function import($libname, $include = null, $exclude = null) {
        $libname=  explode("-", $libname);
        $libname=  implode("/", $libname);
        if(!is_array($include)){
            $tmp=$include;
            $include=array();
            array_push($include, $tmp);
        }
        if(!is_array($exclude)){
            $tmp=$exclude;
            $exclude=array();
            array_push($exclude, $tmp);
        }
        
        if ($exclude != null) {
            $exclude = $this->obtenerArchivosExcluidos($libname, $exclude);
        } 
        if (is_dir($this->prefix . $libname . "/")) {            
            if ($this->existeJson($libname) && $include[0] == null) {
                $this->cargarBase($libname, $this->existeJson($libname), $exclude);
            } elseif ($this->existeJson($libname) && $include[0] == 'all') {
                $this->cargarTodo($libname, $this->existeJson($libname), $exclude);
            } else {
                $this->importarElementos($libname, $include, $exclude);
            }
        }
    }

    public function existeJson($libname) {
        if (file_exists($this->prefix . $libname . "/composer.json")) {
            return json_decode(file_get_contents($this->prefix . $libname . "/composer.json"));
        }
        return false;
    }

    public function cargarBase($libname, $jsonContent, $exclude) {
        $include = $jsonContent->base;
        $this->importarElementos($libname, $include, $exclude);
    }

    public function importarElementos($libname, $include, $exclude) {        
        $jsonContent = $this->existeJson($libname);
        foreach ($include as $elemento) {
            if ($jsonContent && $this->existeEtiqueta($jsonContent, $elemento)) {
                $this->importarEtiqueta($libname, $jsonContent, $elemento, $exclude);
            } else if (is_dir($this->prefix . $libname . "/" . $elemento)) {
                $this->importarDirectorio($libname, $this->prefix . $libname . "/" . $elemento, $exclude);
            } else if (is_file($this->prefix . $libname . "/" . $elemento) && !in_array($elemento, $exclude)) {                               
                $this->importarArchivo($libname . "/" . $elemento);
            }
        }
    }

    public function importarEtiqueta($libname, $jsonContent, $tag, $exclude) {
        foreach ($jsonContent as $key => $value) {
            if ($key == $tag) {
                $this->importarElementos($libname, $value, $exclude);
            }
        }
    }

    public function existeEtiqueta($jsonContent, $tag) {
        foreach ($jsonContent as $key => $value) {
            if ($key == $tag) {
                return true;
            }
        }
        return false;
    }

    public function cargarTodo($libname, $jsonContent, $exclude) {
        foreach ($jsonContent as $key => $value) {
            if (!in_array($key, $exclude)) {
                $this->importarElementos($libname, $value, $exclude);
            }
        }
    }

    public function importarDirectorio($libname, $dir, $excluir) {
        $resource = opendir($dir);
        while ($elemento = readdir($resource)) {
            if ($elemento != '.' && $elemento != ".." && !in_array($elemento, $excluir)) {
                $this->importarElementos($libname, array("/" . basename($dir).$elemento), $excluir);
            }
        }
    }

    public function importarArchivo($file) {
        $resp = $this->location . $file;

        if (preg_match('/.css$/', $file)) {

            echo "<link media='all' rel='stylesheet' href='$resp'/>";
        } elseif (preg_match('/.js$/', $file)) {

            echo"<script type='text/javascript' src='$resp'></script>";
        }
    }

    public function obtenerArchivosExcluidos($libname, $exclude) {

        $jsonContent = $this->existeJson($libname);
        $resp = array();
        foreach ($exclude as $elemento) {
            if ($jsonContent != null && $this->existeEtiqueta($jsonContent, $elemento)) {
                foreach ($jsonContent as $key => $value) {
                    if ($key == $elemento) {
                        $resp = array_merge($resp, $value);
                    }
                }
            } else if (is_dir($this->prefix . $libname . "/" . $elemento)) {
                $resp = array_merge($resp, $this->obtenerFicherosDirectorio($libname, $elemento));
            } else if (is_file($this->prefix . $libname . "/" . $elemento)) {
                array_push($resp, $elemento);
            }
        }
        return $resp;
    }

    public function obtenerFicherosDirectorio($libname, $dir) {
        $resp = array();
        $resource = opendir($this->prefix . $libname . "/" . $dir);
        while ($elemento = readdir($resource)) {
            if ($elemento != '.' && $elemento != "..") {

                if (is_dir($this->prefix . $libname . "/" . $dir . "/" . $elemento)) {
                    $resp = array_merge($resp, $this->obtenerFicherosDirectorio($libname, basename($dir) . "/" . $elemento));
                } else if (is_file($this->prefix . $libname . "/" . $dir . "/" . $elemento) && preg_match('/.css$/', $elemento) || preg_match('/.js$/', $elemento)) {
                    array_push($resp, $dir . $elemento);
                }
            }
        }
        return $resp;
    }

    public function url($libname) {
        "/../../../web/lib/adapters/" . $libname . "/";
    }

}
