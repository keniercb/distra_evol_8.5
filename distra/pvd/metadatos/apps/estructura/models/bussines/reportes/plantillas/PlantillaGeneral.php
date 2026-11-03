<?php

    /**
     * Descripción de la clase: Generada por Doctrine Generate
     *
     * @author    : Generada por Doctrine Generate
     * @copyright Copyright (c) 2013 xetid
     * @version   Release: @package_version@
     */
class PlantillaGeneral extends fpdf
{
    private $pdf;
    private $table;
    private $haveData;
    private $config;
    private $datos;

    /**
     * Descripción del método: Inserta una nueva configuración.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     *
     * @param $pdf
     * @param $config Configuración del reporte.
     * @param $datos
     *
     * @copyright Copyright (c) 2013 xetid.
     */
    public function __construct($pdf, $config, $datos)
    {
        $this->pdf = $pdf;
        $this->table = new Table($this->pdf);
        $this->config = $config;
        $this->datos = $datos;
        $this->haveData = TRUE;
        $this->pdf->SetMargins(5, 5, 5);
        $this->pdf->SetFillColor(200, 200, 200);
        }

    /**
     * Descripción del método: Crea los datos para los reportes de la configuración.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     * @copyright Copyright (c) 2013 xetid.
     */
    public function createPlantilla($aprueba, $elabora)
    {
        //Util::msg($this->config);
        if ($this->config['idresolucion'] == 'MTSS') {
            $plantilla = new PlantillaMTSS($this->pdf, $this->config, $this->datos);
            $plantilla->aprueba = $aprueba;
            $plantilla->elabora = $elabora;
            $pageNum = $plantilla->createAnexo($aprueba, $elabora);
        } else {
            if ($this->config['idresolucion'] == 'GAE') {
                $plantilla = new PlantillaGAE($this->pdf, $this->config, $this->datos);
                $pageNum = $plantilla->createAnexo();
            } else {
                if ($this->config['idresolucion'] == 'MINFAR') {
                    $plantilla = new PlantillaCayo($this->pdf, $this->config, $this->datos);
                    $pageNum = $plantilla->createAnexo();
                }
            }
        }
        
        return $pageNum;
    }
    }