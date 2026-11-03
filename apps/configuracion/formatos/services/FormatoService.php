<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Service
 * @copyright  XETID
 * @version    1.0
 */
class FormatoService extends ZendExt_Model
{

    var $formatos;

    /**
     * Constuctor de la clase
     */
    public function __construct() 
    {
        $this->formatos = new FormatoModel();
    }

    /**
     * Formato
     * 
     * @param int $idformato Identificador de formato
     * @return array Retorna un arreglo con los datos del formato 
     */
    public static function Formato($idformato = 0) 
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $identidad = $global->Estructura->idestructura;
        $formatos = DatFormato::Formatos('', array('idformato' => $idformato, 'idestructuracomun' => $identidad));
        if ($formatos) {
            $standard = new ZendExt_ClassStandard();
            return $standard->ArrayObject($formatos);
        }
        return array();
    }

    /**
     * Nivel de formato
     * 
     * @param int $idformato Identificador de formato
     * @return array Retorna un arreglo con los datos de parte formato
     */
    public static function NiveldeFormato($idformato) 
    {
        $standard = new ZendExt_ClassStandard();
        $parteformato = DatParteformato::ParteFormato('', array('idformato' => $idformato));
        if ($parteformato)
            return $standard->ArrayObject($parteformato);
        return array();
    }

    /**
     * Obtener parte formato por id
     * 
     * @param int $idparteformato Identificador de parte formato
     * @return array Retorna un arreglo con los datos de parte formato
     */
    public static function ObtenerParteFormatoPorId($idparteformato) 
    {
        $standard = new ZendExt_ClassStandard();
        $parteformato = DatParteformato::ParteFormato('', array('idparteformato' => $idparteformato));
        if ($parteformato)
            return $standard->ArrayObject($parteformato);
        return array();
    }

    /**
     * Obtener parte formato por nivel
     * 
     * @param int $idformato Identificador de formato
     * @param int $nivel Valor del nivel
     * @return array Retorna un arreglo con los datos de parte formato por nivel
     */
    public function ObtenerParteFormatosPorNivel($idformato, $nivel) 
    {
        $partes = DatParteformato::ParteFormato('nombre, nivel', array('idformato' => $idformato, 'nivel' => $nivel));
        if (count($partes)) {
            $standard = new ZendExt_ClassStandard();
            return $standard->ArrayObject($partes);
        }
        return array();
    }

    /**
     * Buscar formato por subsistema
     * 
     * @param int $identidad Identificador de entidad
     * @param int $idsubsistema Identificador de subsistema
     * @return array Retorna un arreglo con los datos de los formatos
     */
   

    /**
     * Buscar formato por subsistema
     * 
     * @param int $identidad Identificador de entidad
     * @param int $idsubsistema Identificador de subsistema
     * @return array Retorna un arreglo con los datos de los formatos
     */
    public static function buscarFormatosPorSubsist($identidad, $idsubsistema) 
    {
        if (!$identidad) {
            $global = ZendExt_GlobalConcept::getInstance();
            $identidad = $global->Estructura->idestructura;
        }
        $formatos = DatFormato::FormatosPorSubs($identidad, $idsubsistema);
        $array = NULL;
        if (count($formatos)) {
            $field = array_keys($formatos[0]);
            $i = 0;
            foreach ($formatos as $vlp) {
                $array[] = new stdClass();
                foreach ($field as $j => $d) {
                    $j++;
                    $array[$i]->$d = $vlp[$d];
                }
                $i++;
            }
        }
        return $array;
    }

    /**
     * Formatos
     * 
     * @param int $idformato Identificador de formato
     * @param int $identidad Identificador de entidad
     * @return array Retorna un arreglo con los datos de los formatos
     */
    public static function Formatos($idformato = 0, $identidad = 0) 
    {
        if (!$identidad) {
            $global = ZendExt_GlobalConcept::getInstance();
            $identidad = $global->Estructura->idestructura;
        }
        $formatos = DatFormato::Formatos('', array('idformato' => $idformato, 'idestructuracomun' => $identidad));
        $array = NULL;
        $field = array_keys($formatos[0]);
        $i = 0;
        foreach ($formatos as $vlp) {
            $array[] = new stdClass();
            foreach ($field as $j => $d
            )
                $j++;
            $array[$i]->$d = $vlp[$d];
            $i++;
        }
        return $array;
    }

    /**
     * Formato por id formato
     * 
     * @param int $idformato Identificador de formato
     * @return object Retorna un objeto con los datos del formato
     */
    public static function FormatoPorIdFormato($idformato) 
    {
        $formatos = DatFormato::FormatosPorId($idformato);
        if ($formatos) {
            $standard = new ZendExt_ClassStandard();
            return $standard->Object($formatos);
        }
        return new stdClass();
    }

    /**
     * Formato parrafo
     * 
     * @return array Retorna un array con los datos de los formatos
     */
    public static function formatoParrafo() 
    {
        $formatos = DatFormato::FormatoParrafo();
        return $formatos;
    }

    /**
     * Heredar formatos
     *
     * @param  int $idestructura Identificador de estructura
     * @param  int $idformato Identificador de formato
     * @return int Retorna el valor identificador de formato
     * 
     */
    public function heredarFormato($agIdestructura, $agIdformato) 
    {
        $formato = DatFormato::Formatos('', array('idformato' => $agIdformato));
        if (isset($formato[0]['idformato'])) {
            $datFormato = new DatFormato();
            $datFormato->nombre = $formato[0]['nombre'];
            $datFormato->descripcion = $formato[0]['descripcion'];
            $datFormato->separador = $formato[0]['separador'];
            $datFormato->version = 0;
            $datFormato->idestructuracomun = $agIdestructura;
            $formatoModel = new FormatoModel();
            $insertado = $formatoModel->insertarDatFormato($datFormato, $agIdestructura);
            if ($insertado) {
                $partesformato = $this->NiveldeFormato($agIdformato);
                $parteformatoModel = new ParteformatoModel();
                foreach ($partesformato as $variable) {
                    $datParteformato = new DatParteformato();
                    $datParteformato->nombre = $variable->nombre;
                    $datParteformato->abreviatura = $variable->abreviatura;
                    $datParteformato->nivel = $variable->nivel;
                    $datParteformato->longitud = $variable->longitud;
                    $datParteformato->idformato = $datFormato->idformato;
                    $parteformatoModel->insertarDatParteformato($datParteformato);
                }
                $this->conn->commit();
                return $datFormato->idformato;
            } else {
                $formato = $datFormato
                        ->buscarFormato(array('nombre' => $datFormato->nombre, 'idestructuracomun' => $agIdestructura));
                return $formato['datos'][0]['idformato'];
            }
        } else
            return 0;
    }

    /**
     * Cantidad de formato
     *
     * @return int Retorna la cantidad de formatos asociados a la estructura
     * 
     */
    public function cantidadFormatoIn() 
    {
        $idEstructura = $this->global->Estructura->idestructura;
        return $this->formatos->cantidadFormatoIn($idEstructura);
    }

    /**
     * Cantidad parte de formato
     *
     * @return int Retorna la cantidad de formatos asociados a la estructura
     * 
     */
    public function cantidadParteFormatoIn() 
    {
        $idEstructura = $this->global->Estructura->idestructura;
        return $this->formatos->cantidadParteFormatoIn($idEstructura);
    }

    /**
     * Obtener partes formato por nivel
     *
     * @param int $agIdformato Identificador de formato
     * @param int $agNivel Valor del nivel
     * @return object Retorna un objeto con los datos del nivel de formato 
     * 
     */
    public function obtenerParteFormatoPorNivel($agIdFormato, $agNivel) 
    {
        return DatParteformato::obtenerParteFormatoPorNivel($agIdFormato, $agNivel);
    }

    /**
     * Listar formatos
     *
     * @param int $idformato Identificador de formato
     * @return array Retorna un arreglo con los datos de los formatos
     * 
     */
    public static function ListarFormatos($idformato = 0) 
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $identidad = $global->Estructura->idestructura;
        $formatos = DatFormato::Formatos('', array('idformato' => $idformato, 'idestructuracomun' => $identidad));
        if ($formatos) {
            $standard = new ZendExt_ClassStandard();
            return $standard->ArrayObject($formatos);
        }
        return array();
    }

}
