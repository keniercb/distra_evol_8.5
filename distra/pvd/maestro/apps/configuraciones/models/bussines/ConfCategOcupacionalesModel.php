<?php
/**
 * @name ConfEstructuraconceptoModel - Clase de logica de negocio para la configuracion de de estructuras por conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfCategOcupacionalesModel extends ZendExt_Model
{
    /**
     * Constructor de la clase
     */
    public function init()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method obtenerEstructura - Devuelve la estructura organizativa.
     * @params $idestructura - Identificador de la estructura organizativa.
     * @return array - Arreglo con las estructuras.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getCategoriasOcup()
    {
        try {
            //Verificando si se esta cargando desde la raiz del arbol
             $result=ConfCategOcupacionales::getCategoriasOcup();
            return $result;
        } catch (Exception $e) {
            return Array();
        }
    }

    public function modCategoriasOcup($idmapeocategocup,$idcategocup, $idcategoriareporte)
    {
        try {
          if($idmapeocategocup){
              $cfg =ConfCategOcupacionales::obtenerPorId($idmapeocategocup);
              $cfg->idcategocup = $idcategocup;
              $cfg->idcategoriareporte = $idcategoriareporte;
              $cfg->save();
          }
           else{
                $cfg=new ConfCategOcupacionales();
                $cfg->idcategocup = $idcategocup;
                $cfg->idcategoriareporte = $idcategoriareporte;
                $cfg->save();
            }


            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function modCategoriasOcupResumenMov($idmapeocategocup, $idcategocup, $idcategoriareporteresumenmov)
    {
        try {
            if ($idmapeocategocup) {
                $cfg = ConfCategOcupacionales::obtenerPorId($idmapeocategocup);
                $cfg->idcategocup = $idcategocup;
                $cfg->idcategoriareporteresumenmov = $idcategoriareporteresumenmov;
                $cfg->save();
            } else {
                $cfg = new ConfCategOcupacionales();
                $cfg->idcategocup = $idcategocup;
                $cfg->idcategoriareporteresumenmov = $idcategoriareporteresumenmov;
                $cfg->save();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function limpiarCategOcupParaReportes($idmapeocategocup)
    {
        try {            
          if(!empty($idmapeocategocup)){
              $cfg = ConfCategOcupacionales::obtenerPorId($idmapeocategocup);
              $cfg->delete();
          }          
        return true;        
        } catch (Exception $e) {
            return false;
        }
    }

}