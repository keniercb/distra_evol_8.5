<?php
$dirwww = $_SERVER['DOCUMENT_ROOT'];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = '/';
//Direccion absoluta del marco de trabajo
//$dirabsmt = str_replace('//', '/', dirname($dirwww . '..') . '/' . $dirrelmt);
$dirabsmt = str_replace("//", "/", str_replace('web','',$dirwww). $dirrelmt);
$config['include_path'] = get_include_path();
//$config['include_path'] .= '' . PATH_SEPARATOR . $dirabsmt . 'apps/pvd/persona/arquitectura/controllers';
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "apps/pvd/comun/controllers";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config['include_path']);

/**
 * Class ConfigurarproyectoModel
 */
class ConfigurarproyectoModel extends ZendExt_Model
{

    protected $objDatProject;
    protected $objDatProjectRol;

    function __construct()
    {
        $this->objDatProject = new DatProyectoModel();
        $this->objDatProjectRol = new DatProyectorol();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener el listado de iconos
     *
     * @return array
     * @throws Exception
     */
    public function getListOfIcons()
    {
        try {
            $sql
                = "SELECT encode(ab1.foto,'escape') AS foto FROM mod_persona.dat_foto ab1
             inner join mod_persona.dat_persona p on(ab1.idpersona = p.idpersona and p.nombre ilike 'olia')
            LIMIT 18 OFFSET 0";
            $query = Doctrine_Manager::getInstance();
            $images = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
//            $dir = 'views/images/icons/';
//            $d = dir($dir);
//            $images = array();
//            $count = 0;
//            while ($name = $d->read()) {
//                if (!preg_match('/\.(jpg|jpeg|gif|png|bmp|JPG|JPEG|GIF|PNG|BMP|Jpg)$/', $name)) continue;
//                $url = '../../' . $dir . $name;
//                $size = filesize($dir . $name) . ' bytes';
//                $arrPrpts = getimagesize($dir . $name);
//                $lastmod = date("F d Y H:i:s", filemtime($dir . $name));
//                $images[$count]['url'] = $url;
//                $images[$count]['denominacion'] = $name;
//                $images[$count]['size'] = $size;
//                $images[$count]['lastmod'] = $lastmod;
//                $images[$count]['width'] = $arrPrpts[0];
//                $images[$count]['height'] = $arrPrpts[1];
//                $images[$count]['perimetro'] = $arrPrpts[0] * $arrPrpts[1];
//                /*$fi = date("Y-m-d");
//                $images[$count]['fechainicio'] = $fi;*/
//                $count++;
//            }
//            $d->close();
            return $images;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para generar los ficheros del proyecto y definir el proyecto como componente en el fichero de
     * configuracion de la plataforma de rrhh
     *
     * @param $idproject
     *
     * @return void
     * @throws Exception
     */
    public function generateProject($idproject)
    {
        try {
            $moduleName = 'personalizacion_persona'; //cable ver proxima solucion
            $projectConfig = $this->objDatProject->getConfigProject($idproject);
            if (!empty($projectConfig)) {
                $objGenerarProject = new GenerateProjectModel($projectConfig[0]);
                $objGenerarProject->generateProject($moduleName);
                $createdFiles = $objGenerarProject->getCreatedFiles();
                $config = $this->generateProjectConfig($projectConfig[0], $createdFiles['client']);
                $objWriteConfig = new GestionarConfiguracion();
                $objWriteConfig->addComponent($config, $moduleName, true);
            } else {
                throw new Exception('No existe ningun proyecto con ese identificador', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para definir la configuracion del proyecto en el fichero de configuracion de la plataforma
     *
     * @param array $projectConfig
     */
    private function generateProjectConfig($projectConfig, $createdFiles)
    {
        $cmpConfig = new GeneratorComponent();
        $cmpConfig->setName($projectConfig['idproyecto']);
        $cmpConfig->setRequired(
            array(
                'module' => 'persona', 'component' => 'persona_generico')
        );
        foreach ($projectConfig['DatProyectoconcepto'] as $k => $v) {
            if ($v['cmpempleado']) {
                $tmp = Zend_Json::decode($v['cmpempleado']);
                $required = new GeneratorRequired($tmp);
                $cmpConfig->setRequired($required);
            }
        }
        foreach ($createdFiles['js'] as $v) {
            $cmpConfig->setJs($v);
        }

        return $cmpConfig;
    }

    public function getCompartimentacion($filtro, $limit, $start)
    {
        try {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql
                = "SELECT
                  drc.idrolcompartimentacion as idcompartimentacion,
                  sr.denominacion,
                  nc.denominacion AS compartimentacion,
                  'roles' AS roluser,
                  sr.idrol as idroluser
                FROM
                  mod_seguridad.seg_rol sr
                  LEFT OUTER JOIN mod_persona.da_rolcompartimentacion drc ON (sr.idrol = drc.idrol)
                  LEFT OUTER JOIN mod_persona.nom_compartimentacion nc ON (nc.idcompartimentacion = drc.idcompartimentacion)

                UNION

                SELECT
                    duc.idusuariocompartimentacion as idcompartimentacion,
                  (su.nombreusuario) AS denominacion,
                  nc.denominacion AS compartimentacion,
                  'users' AS roluser,
                  su.idusuario as idroluser
                FROM
                  mod_seguridad.seg_usuario su
                  LEFT OUTER JOIN mod_persona.dat_usuariocompartimentacion duc ON (su.idusuario = duc.idusuario)
                  left JOIN mod_persona.dat_persona dp ON (su.idpersona = dp.idpersona)
                  LEFT OUTER JOIN mod_persona.nom_compartimentacion nc ON (nc.idcompartimentacion = duc.idcompartimentacion)
                WHERE
                  su.activo = true";

            return $conn->fetchAll($sql);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}