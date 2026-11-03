<?php
$dirwww = $_SERVER['DOCUMENT_ROOT'];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = '/';
//Direccion absoluta del marco de trabajo
//$dirabsmt = str_replace('//', '/', dirname($dirwww . '..') . '/' . $dirrelmt);
$dirabsmt = str_replace("//", "/", str_replace('web','',$dirwww). $dirrelmt);
$config['include_path'] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "apps/pvd/comun/controllers";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config['include_path']);

/**
 * Gestiona los nomencladores de persona
 * Class ConfigurarproyectoController
 */
class NomencladorController extends ControladorBase
{
    private $request;

    function init()
    {
        parent::init();

    }

    function nomencladorAction()
    {
        $this->cargaInicial('persona', 'nomenclador');
        $this->render();
    }

    function getNomencladoresAction()
    {
        $id = $this->_request->getPost('node');
        $menu = array();
        $objModel = new DatNomencladorModel();
        //$this->request = $objModel->getAllNomencladoresVisibles();
        $data = $objModel->getAllNomencladoresVisibles();
        $idpadres = Array();
        foreach ($data as $k => $v) {
            //print_r($v['idpadre']);die;
            $existe = false;
            for($i = 0; $i <= count($idpadres); $i++) {
                if ($idpadres[$i] == $v['idpadre']) {
                    $existe = true;
                }
            }
            if($existe == false){
                array_push($idpadres, $v['idpadre']);
            }
        }
        if($id == 'ynode-17') {
            $menu = array();
            foreach ($idpadres as $k => $v) {
                array_push($menu,
                    array(
                        'visibilidad' => '',
                        'xtype' => '',
                        'getdata' => '',
                        'descripcion' => '',
                        'imagen' => '',
                        'icono' => '',
                        'src' => '',
                        'nombre' => $v,
                        'denominacion' => $v,
                        'agrupador' => $v,
                        'idnomenclador' => $v,
                        'id' => $v,
                        'text' => $v,
                        'name' => '',
                        'iconCls' => '',
                        'checked' => '',
                        'leaf' => '',
                        'qtip' => $v,
                        'idpadre' => 'ynode-17')
                );
            }
        } else {
            foreach ($idpadres as $k => $v) {
                if ($id == $v) {
                    $menu = array();
                    foreach ($data as $key => $value) {
                        if ($value['idpadre'] == $id) {
                            array_push($menu,
                                array(
                                    'visibilidad' => $value['visibilidad'],
                                    'xtype' => $value['xtype'],
                                    'getdata' => $value['getdata'],
                                    'descripcion' => $value['descripcion'],
                                    'imagen' => $value['imagen'],
                                    'icono' => $value['icono'],
                                    'src' => $value['src'],
                                    'nombre' => $value['nombre'],
                                    'denominacion' => $value['denominacion'],
                                    'agrupador' => $value['agrupador'],
                                    'idnomenclador' => $value['idnomenclador'],
                                    'id' => $value['id'],
                                    'text' => $value['text'],
                                    'name' => $value['name'],
                                    'iconCls' => $value['iconCls'],
                                    'checked' => $value['checked'],
                                    'leaf' => $value['leaf'],
                                    'qtip' => $value['qtip'],
                                    'idpadre' => $value['idpadre']
                                )
                            );
                        }
                    }
                }
            }
        }
        /*foreach ($idpadres as $k => $v) {
            if ($id == $v) {
                foreach ($data as $k => $v) {
                    $menu = array(
                        array(
                            'visibilidad' => $v['visibilidad'],
                            'xtype' => $v['xtype'],
                            'getdata' => $v['getdata'],
                            'descripcion' => $v['descripcion'],
                            'imagen' => $v['imagen'],
                            'icono' => $v['icono'],
                            'src' => $v['src'],
                            'nombre' => $v['nombre'],
                            'denominacion' => $v['denominacion'],
                            'agrupador' => $v['agrupador'],
                            'idnomenclador' => $v['idnomenclador'],
                            'id' => $v['id'],
                            'text' => $v['text'],
                            'name' => $v['name'],
                            'iconCls' => $v['iconCls'],
                            'checked' => $v['checked'],
                            'leaf' => $v['leaf'],
                            'qtip' => $v['qtip'],
                            'idpadre' => $v['idpadre']
                        )
                    );
                }
            }
        }*/
        /*
         [visibilidad] => 0
    [xtype] =>
    [getdata] =>
    [descripcion] => Aptitudes físicas
    [imagen] =>
    [icono] => brick
    [src] => ["/pvd/persona/views/js/nomaptitudfisica/nomaptitudfisica.js"]
    [nombre] => PVD.Persona.NomAptitudFisica.ViewGrid
    [denominacion] => Aptitudes físicas
    [agrupador] => Otros
    [idnomenclador] => 35
    [id] => 35
    [text] => Aptitudes físicas
    [name] => PVD.Persona.NomAptitudFisica.ViewGrid
    [iconCls] => brick
    [checked] =>
    [leaf] => 1
    [qtip] => Aptitudes físicas
    [idpadre] => Otros
        */
        //print_r($idpadres);die;
        //print_r($this->request);die;
        /* $this->request = array(
             array('id' => 'colorojo',
                 'text' => 'Color de ojos', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomColorOjos.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomcolorojos/nomcolorojos.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'colorpiel',
                 'text' => 'Color de piel', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomColorPiel.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomcolorpiel/nomcolorpiel.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'colorpelo',
                 'text' => 'Color de pelo', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomColorPelo.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomcolorpelo/nomcolorpelo.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'padecimiento',
                 'text' => 'Padecimineto', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomPadecimineto.ViewGrid',
                 'src' => '/pvd/persona/views/js/nompadecimiento/nompadecimiento.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'tipodocidentidad',
                 'text' => 'Tipo documento de identidad', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomTipoDocIdentidad.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomtipodocidentidad/nomtipodocidentidad.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'gruposanguineo',
                 'text' => 'Grupo sanguíneo', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomGrupoSanguineo.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomgruposanguineo/nomgruposanguineo.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'nacionalidad',
                 'text' => 'Nacionalidad', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomNacionalidad.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomnacionalidad/nomnacionalidad.js',
                 'css' => '/pvd/persona/views/css/sprite-flags.css',
                 'iconCls' => 'brick'
             ),
             array('id' => 'prenda',
                 'text' => 'Prenda', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomPrenda.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomprenda/nomprenda.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'talla',
                 'text' => 'Talla', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomTalla.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomtalla/nomtalla.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'norma',
                 'text' => 'Norma', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomNorma.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomnorma/nomnorma.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'ciudadania',
                 'text' => 'Ciudadanía', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomCiudadania.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomciudadania/nomciudadania.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'tipomediocontacto',
                 'text' => 'Tipo medio contacto', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomTipoMedioContacto.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomtipomediocontacto/nomtipomediocontacto.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'tipocontacto',
                 'text' => 'Tipo de contacto', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomTipoContacto.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomtipocontacto/nomtipocontacto.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'procedenciasocial',
                 'text' => 'Procedencia social', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomProcedenciaSocial.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomprocedenciasocial/nomprocedenciasocial.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'tipocuentabancaria',
                 'text' => 'Tipo cuenta bancaria', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomTipoCuentaBancaria.ViewGrid',
                 'src' => '/pvd/persona/views/js/nomtipocuentabancaria/nomtipocuentabancaria.js',
                 'iconCls' => 'brick'
             ),
             array('id' => 'motivobaja',
                 'text' => 'Motivo de baja', 'leaf' => true, 'checked' => false, 'leaf' => true,
                 'name' => 'PVD.Persona.NomMotivoBaja.ViewGrid',
                 'src' => '/pvd/persona/views/js/nommotivobaja/nommotivobaja.js',
                 'iconCls' => 'brick'
             )
         );*/
        $this->request = $menu;
        $this->returnRequest();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

}