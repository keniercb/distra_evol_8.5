<?php
$dirwww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = "/";
//Direccion absoluta del marco de trabajo
//$dirabsmt = str_replace("//", "/", dirname($dirwww . "..") . "/" . $dirrelmt);
$dirabsmt = str_replace("web", "apps", $dirwww);
$config["include_path"] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "/pvd/persona/projects/cayococo/models/domain/generated";
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "/pvd/persona/projects/cayococo/models/domain";
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "/pvd/persona/projects/cayococo/models/bussines";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config["include_path"]);

class PersonaCayoService
{
    protected $_objPersona;

    function __construct()
    {
        //$this->_objPersona = new DatpersonasiacModel();
        $this->objOcupacion = new DatOcupacionccModel();
    }

    public function getOcupacionActualPersonaXEntidad($idpersona, $identidad)
    {
        try {
            return $this->objOcupacion->getOcupacionActualPersonaXEntidad($idpersona, $identidad);
        } catch (Exception $e) {
            throw $e;
        }
    }
}