<?php
$dirwww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = "/";
//Direccion absoluta del marco de trabajo
//$dirabsmt = str_replace("//", "/", dirname($dirwww . "..") . "/" . $dirrelmt);
$dirabsmt = str_replace("web", "apps", $dirwww);
$config["include_path"] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "/pvd/persona/projects/siac/models/domain/generated";
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "/pvd/persona/projects/siac/models/domain";
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "/pvd/persona/projects/siac/models/bussines";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config["include_path"]);

class PersonaSiacService
{
    protected $objPersona;

    function __construct()
    {
        $this->objPersona = new DatpersonasiacModel();
        //$this->objOcupacion = new DatOcupacionsiacModel();
    }

    public function getPrincipalesDatosPersonaSIAC($idpersona, $filtro, $limit, $start = 0, $identidad, $idcargo)
    {
        try {
            return $this->objPersona->getPrincipalesDatosPersonaById(
                $idpersona, $filtro, $limit, $start = 0, $identidad, $idcargo
            );
        } catch (Exception $e) {
            throw $e;
        }
    }
}