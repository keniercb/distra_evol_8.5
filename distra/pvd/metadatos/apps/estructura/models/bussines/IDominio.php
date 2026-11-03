<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class IDominio extends ZendExt_Model
{
    /**
     * Enter description here...
     *
     * @var DominioModel
     */
    var $dominio;

    /**
     * Constructor de la interfaz, destinado a reservar para objetos de tipo model
     *
     * @return IDominio
     */
    function __construct()
    {
        $this->dominio = new DominioModel();
    }

    /**
     * Descripción del método: Obtener los hijos de una estructura por seguridad
     *
     * @author    : Seguridad
     *
     * @param bool $iddominio
     * @param bool $idestructura
     * @param bool $checked
     * @param bool $checkear
     * @param bool $arrayTiposEAV
     *
     * @return array
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarHijosEstructuras(
        $iddominio = false, $idestructura = false, $checked = false, $checkear = false, $arrayTiposEAV = false
    )
    {
        return $this->dominio->buscarHijosEstructuras(
                             $iddominio, $idestructura, $checked, $checkear, $arrayTiposEAV
        );
    }

    /**
     * Retorna un listado de identificadores de estructura hijos de la estructura dada por parametros
     * a las cuales tiene acceso el usuario logueado en el sistema dentro de su dominio.
     *
     * @param         $arrayIdAcceso
     * @param integer $identidad Identificador de la estructura.
     *
     * @return array Listado de identificadores de estructura.
     */
    public function obtenerListadoIdEstructura($arrayIdAcceso, $identidad)
    {
        return $this->dominio->obtenerListadoIdEstructura($arrayIdAcceso, $identidad);
    }

    /**
     * Retorna un listado de las entidades que pertenecen a los roles del usuario.
     *
     * @author Darien Garcia Tejo.
     *
     * @param array $arrayUsuarioRolAcceso - Listado de identificadores de posicion del rol.
     *
     * @return Listado de entidades que pertenecen a los roles del usuario.
     */
    function obtenerListadoEntidadesUsuarioRol($arrayUsuarioRolAcceso)
    {
        $arrayResult = array();
        foreach ($arrayUsuarioRolAcceso as $array) {
            $arrayResult[] = array(
                'idusuario' => $array['idusuario'], 'idrol' => $array['idrol'],
                'acceso'    => $this->dominio->obtenerListadoEntidadesUsuarioRol($array['identidad']));
        }

        return $arrayResult;
    }

    /**
     * Obtener los hijos de un arreglo de estructura
     *
     * @author    : Seguridad
     *
     * @param      $acceso
     * @param      $iddominio
     * @param bool $idestructura
     * @param bool $checked
     * @param bool $arrayIdestructura
     *
     * @return array
     */
    function buscarHijosEstructurasDadoArray(
        $acceso, $iddominio, $idestructura = false, $checked = false, $arrayIdestructura = false
    )
    {
        return $this->dominio->buscarHijosEstructurasDadoArray(
                             $acceso, $iddominio, $idestructura, $checked, $arrayIdestructura
        );
    }

    /**
     * Descripción del método: Obtener los hijos de una estructura por seguridad de forma lineal
     *
     * @author    : Seguridad
     *
     * @param bool $iddominio
     * @param bool $idestructura
     * @param bool $checked
     * @param bool $checkear
     * @param bool $arrayTiposEAV
     *
     * @return array
     * @copyright Copyright (c) 2013 xetid
     */
    function buscarHijosEstructurasLineal(
        $iddominio = false, $idestructura = false, $checked = false, $checkear = false, $arrayTiposEAV = false
    )
    {
        return $this->dominio->buscarHijosEstructurasLineal(
                             $iddominio, $idestructura, $checked, $checkear, $arrayTiposEAV
        );
    }

    /**
     * @author Darien Garcia Tejo.
     *
     * @param type $iddominio    - Identificador del dominio del usuario autenticado.
     * @param type $arrayAccesos - Listado de identificadores de posicion del rol.
     *
     * @return Listado de entidades que pertenecen a los roles del usuario.
     */
    function getIdsEntityByRoleIndex($iddominio, $arrayAccesos)
    {
        $cantAccess = count($arrayAccesos);
        $cont = 0;
        $sql = "";
        foreach ($arrayAccesos as $acceso) {
            if ($cantAccess > $cont) {
                if ($sql == "") {
                    $sql = "accesofila[$acceso]=1::bit";
                } else {
                    $sql .= " OR accesofila[$acceso]=1::bit";
                }
            }
            $cont++;
        }

        return self::convertToUnidimensional($this->dominio->getIdsEntityByRoleIndex($iddominio, $sql), 'idfila');
    }

    /**
     * @author Darien Garcia Tejo.
     * @method convertToUnidimensional - Funci�n usada para convertir un arreglo vidimencional a unidimencional.
     *
     * @param array  $array  - Arreglo de valores.
     * @param string $indice - Indice por el que se realizara la converci�n.
     *
     * @return array - Arreglo unidimencional.
     */
    private static function convertToUnidimensional($array, $indice)
    {
        $arrayResult = array();
        if (count($array) > 0) {
            foreach ($array as $values) {
                array_push($arrayResult, $values[$indice]);
            }
        }

        return $arrayResult;
    }

    /**
     *  Obtener los hijos de una estructura
     *
     * @author    : Seguridad
     *
     * @param $idestructura
     *
     * @return array
     */
    function buscarArbolHijosEstructuras($idestructura)
    {
        return $this->dominio->buscarArbolHijosEstructuras($idestructura);
    }

    /**
     * Obtener los hijos de un arreglo de estructura
     *
     * @author    : Seguridad
     *
     * @param      $iddominio
     * @param bool $arrayIdestructura
     * @param      $tipoEAV
     * @param      $idnomeav
     *
     * @return array
     */
    function buscarIdEstructurasDominio($iddominio, $arrayIdestructura, $tipoEAV, $idnomeav)
    {
        return $this->dominio->buscarIdEstructurasDominio($iddominio, $arrayIdestructura, $tipoEAV, $idnomeav);
    }

    /**
     * Obtener los hijos de un arreglo de estructura
     *
     * @author    : Seguridad
     *
     * @param      $iddominio
     * @param bool $arrayIdestructura
     * @param      $tipoEAV
     *
     * @return array
     */
    function cantIdEstructurasDominio($iddominio, $arrayIdestructura, $tipoEAV)
    {
        return $this->dominio->cantIdEstructurasDominio($iddominio, $arrayIdestructura, $tipoEAV);
    }

    /**
     * Retorna el arbol de dominio
     *
     * @author Seguridad.
     *
     * @param $iddominio
     *
     * @return array
     */
    function cargarArbolDominios($iddominio)
    {
        return $this->dominio->cargarArbolDominios($iddominio);
    }

    /**
     * Lista las estructuras del dominio en las que un usuario determinado tenga acceso.
     *
     * @author Seguridad.
     *
     * @param $arrayPadres
     *
     * @return array Retorna un listado con de estructuras.
     */
    function buscarArbolHijosDominio($arrayPadres)
    {
        return $this->dominio->buscarArbolHijosDominio($arrayPadres);
    }

    /**
     * Lista las estructuras del dominio en las que un usuario determinado tenga acceso.
     *
     * @author Seguridad.
     *
     * @param bool|int $idestructura - Identificador de la estructura desplegada | 0.
     * @param array    $arrayAccess  - Arreglo de accesos.
     *
     * @return array Retorna un listado con de estructuras.
     */
    function loadAccessDomain($idestructura = false, $arrayAccess = array())
    {
        return $this->dominio->loadAccessDomain($idestructura, $arrayAccess);
    }

    /**
     * Actualizar la asignacion de un rol a un usuario en una estructura.
     *
     * @author    : Seguridad
     *
     * @param int   $iddominio Identificador del dominio.
     * @param int   $idacceso  Numero consecutivo que representa a un rol asignado a un usuario en una estructura.
     * @param array $array     Arreglo multidimensional de estructuras (dimensiones: padres, estructuras,
     *                         arrayEntidadesEliminar, arrayPadresEliminar).
     *
     * @return bool Verdadero si todo se realizo correctamente.
     */
    function asignarAccesoRoles($iddominio, $idacceso, $array)
    {
        return $this->dominio->asignarAccesoRoles($iddominio, $idacceso, $array);
    }

    /**
     * Buscar las estructuras en las que se le asigno un rol a un usuario.
     *
     * @author    : Seguridad
     *
     * @param int   $iddominio     Identificador de dominio.
     * @param       $arrayEstNoRol Numero consecutivo que representa a un rol asignado a un usuario en una estructura.
     * @param array $arrayEst      Arreglo de estructuras.
     *
     * @return array Arreglo de identificadores de estructuras.
     */
    function accesoDadoArrayNoRol($iddominio, $arrayEstNoRol, $arrayEst)
    {
        $arrayResult = array();
        foreach ($arrayEstNoRol as $idacceso) {
            $datos = $this->dominio->accesoDadoArrayNoRol($iddominio,$idacceso ['identidad'],$arrayEst);
            if (count($datos)) {
                foreach ($datos as $valores) {
                    $arrayResult [] = $valores ['id'];
                }
            }
        }

        return $arrayResult;
    }

    /**
     * Buscar la cantidad de estructuras en las que se le asigno un rol a un usuario.
     *
     * @author    : Seguridad
     *
     * @param int $idacceso  Numero consecutivo que representa a un rol asignado a un usuario en una estructura.
     * @param int $iddominio Identificador de dominio.
     *
     * @return int Cantidad de estructuras.
     */
    function cantAccesoFilas($idacceso, $iddominio)
    {
        return $this->dominio->cantAccesoFilas($idacceso, $iddominio);
    }

    /**
     * Buscar las estructuras en las que se le asigno un rol a un usuario.
     *
     * @author    : Seguridad
     *
     * @param int $iddominio           Identificador de dominio.
     * @param     $arrayTodasNoRol     Numero consecutivo que representa a un rol
     *                                 asignado a un usuario en una estructura.
     * @param     $arrayEstructurasIns Arreglo de identificadores de estructuras.
     *
     * @return array Arreglo bidimensional de identificadores estructuras.
     */
    function verificarAccesoEstrucExternas($iddominio, $arrayTodasNoRol, $arrayEstructurasIns)
    {
        if (count($arrayTodasNoRol)) {
            foreach ($arrayTodasNoRol as $acceso) {
                if (count($this->dominio->verificarAccesoEstrucExternas($iddominio, $acceso ['identidad'], array()))
                ) {
                    return true;
                }
            }
        } elseif (count($arrayEstructurasIns)) {
            if (count($this->dominio->verificarAccesoEstrucExternas($iddominio, 0, $arrayEstructurasIns))) {
                return true;
            }
        } else {
            return false;
        }
    }

    /**
     * Obtener Acceso a la estructura
     *
     * @author    : Seguridad
     *
     * @param $identidad
     * @param $iddominio
     * @param $arrayAccesos
     *
     * @return array
     */
    function getAccess($identidad, $iddominio, $arrayAccesos)
    {
        foreach ($arrayAccesos as $acceso) {
            if (count($this->dominio->getAccess($identidad, $iddominio, $acceso ['identidad']))) {
                return $acceso ['identidad'];
            }
        }

        return 0;
    }
}


