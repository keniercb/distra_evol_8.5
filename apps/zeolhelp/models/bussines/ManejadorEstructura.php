<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ManejadorEstructura
 *
 * @author jose
 */
class ManejadorEstructura extends ZendExt_Model
{

    public $dirPlantilla;
    public $dirWeb;
    public $arrayExtFileValid;

    function ManejadorEstructura()
    {
        parent::ZendExt_Model();
        $this->dirPlantilla = dirname(__FILE__) . '/../../../../web/zeolhelp/resources/plantillas/';
        $this->dirWeb = dirname(__FILE__) . '/../../../../web/';
    }

    public function createEstructura($dirName, $arrays, $flag = false)
    {
        if (isset($arrays['name'])) {
            $cmd = "mkdir ". $dirName . '/' . $arrays['name'];
            shell_exec($cmd);
            //mkdir($dirName . '/' . $arrays['name'], 0777);
        }
        if (isset($arrays['directorios'])) {
            foreach ($arrays['directorios'] as $directory) {
                $this->createEstructura(
                    $dirName . '/' . $arrays['name'],
                    $directory
                );
            }
        }
        if (isset($arrays['files'])) {
            foreach ($arrays['files'] as $file) {
                    $name = ($flag) ? $file['plantillaFrameWork'] : $file['plantilla'];

                    shell_exec( "cp " . $this->dirWeb . $name . '/' . $file['name'] . '.' . $file['ext'] . ' ' .
                        $dirName );

            }
        }
    }

    private function idCorrect(DOMNamedNodeMap $attributeList, $id = false)
    {
        foreach ($attributeList as $attr) {
            if ($attr->nodeName == 'id') {
                if ($id) {
                    if ($attr->nodeValue == $id) {
                        return true;
                    }

                    return false;
                } else {
                    if ($attr->nodeValue != '') {
                        return true;
                    }

                    return false;
                }
            }
        }

        return false;
    }

    private function hrefCorrect(DOMNamedNodeMap $attributeList, $idli = false)
    {
        foreach ($attributeList as $attr) {
            if ($attr->nodeName == 'href') {
                if ($attr->nodeValue == "#" . urlencode($idli) . "_context") {
                    return true;
                } else {
                    return false;
                }
            }
        }

        return false;
    }

    private function classCorrect(DOMNamedNodeMap $attributeList, $parameter)
    {
        foreach ($attributeList as $attr) {
            if ($attr->nodeName == 'class') {
                if ($attr->nodeValue == $parameter) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        return false;
    }

    private function uriCorrect(DOMNamedNodeMap $attributeList, $bandera = true)
    {
        if ($bandera) {
            foreach ($attributeList as $attr) {
                if ($attr->nodeName == 'uri') {
                    if ($attr->nodeValue != "") {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        } else {
            return true;
        }

        return false;
    }

    private function liIsCorrect(DOMNode $nodeElement, $id, $valueClass = false)
    {
        $array = $this->countChildrensDistintAandText($nodeElement);
        if ($array['distint'] > 0) {
            return false;
        }
        if ($array['equals'] != 1) {
            return false;
        }
        $attr = $nodeElement->attributes;
        if (!$this->idCorrect($attr, $id)) {
            return false;
        }
        if ($valueClass) {
            if (!$this->classCorrect($attr, $valueClass)) {
                return false;
            }
        }

        return true;
    }

    private function aIsCorrect(DOMNode $nodeElement, $idli, $bandera = true)
    {
        $attr = $nodeElement->attributes;
        if (!$this->hrefCorrect($attr, $idli)) {
            return false;
        }
        if (!$this->uriCorrect($attr, $bandera)) {
            return false;
        }

        return true;
    }

    private function ulIsCorrect(
        DOMNode $nodeElement,
        $valueClass,
        $valueID = false
    )
    {
        $attr = $nodeElement->attributes;
        if ($valueID) {
            if (!$this->idCorrect($attr, $valueID)) {
                return false;
            }
        }
        if (!$this->classCorrect($attr, $valueClass)) {
            return false;
        }

        return true;
    }

    private function divIsCorrect(DOMNode $nodeElement, $valueClass)
    {
        $arrays = $this->countChildrensDistintDivSectionandText($nodeElement);
        if ($arrays['distint'] > 0) {
            return false;
        }
        if ($arrays['equals'] != 1) {
            return false;
        }
        $attr = $nodeElement->attributes;
        if (!$this->idCorrect($attr, false)) {
            return false;
        }
        if (!$this->classCorrect($attr, $valueClass)) {
            return false;
        }
        if (!$this->hasSection($nodeElement->childNodes)) {
            return false;
        }

        return true;
    }

    private function hasSection(DOMNodeList $nodeList)
    {
        foreach ($nodeList as $node) {
            if ($node->nodeName == 'section') {
                return true;
            }
        }

        return false;
    }

    public function getElement(DOMNodeList $nodeList, $nodeName)
    {
        foreach ($nodeList as $node) {
            if ($node->nodeName == $nodeName) {
                return $node;
            }
        }

        return null;
    }

    public function countChildrensDistintLiandText(DOMNode $node)
    {
        $childList = $node->childNodes;
        $array = array(
            'distint' => 0,
            'equals' => 0
        );
        foreach ($childList as $child) {
            if ($child->nodeName != "li" && $child->nodeName != "#text") {
                $array['distint']++;
            }
            if ($child->nodeName == "li") {
                $array['equals']++;
            }
        }

        return $array;
    }

    private function countChildrensDistintDivSectionandText(DOMNode $node)
    {
        $childList = $node->childNodes;
        $array = array(
            'distint' => 0,
            'equals' => 0
        );
        foreach ($childList as $child) {
            if ($child->nodeName != "section" && $child->nodeName != "#text" && $child->nodeName != "div"
            ) {
                $array['distint']++;
            }
            if ($child->nodeName == "section") {
                $array['equals']++;
            }
        }

        return $array;
    }

    private function countChildrensDistintDivandText(DOMNode $node)
    {
        $childList = $node->childNodes;
        $array = array(
            'distint' => 0,
            'equals' => 0
        );
        foreach ($childList as $child) {
            if ($child->nodeName != "div" && $child->nodeName != "#text") {
                $array['distint']++;
            }
            if ($child->nodeName == "div") {
                $array['equals']++;
            }
        }

        return $array;
    }

    private function countChildrensDistintAandText(DOMNode $node)
    {
        $childList = $node->childNodes;
        $array = array(
            'distint' => 0,
            'equals' => 0
        );
        foreach ($childList as $child) {
            if ($child->nodeName != "a" && $child->nodeName != "#text" && $child->nodeName != "ul"
            ) {
                $array['distint']++;
            }
            if ($child->nodeName == "a") {
                $array['equals']++;
            }
        }

        return $array;
    }

    public function validateHtmlMenu($dirHtmlIndex)
    {
        $dom = new DOMDocument();
        $dom->loadHTMLFile($dirHtmlIndex);
        $ul = $dom->getElementById('menu-indice');
        if (!$ul) {
            return false;
        }
        $div = $dom->getElementById('context');
        if (!$div) {
            return false;
        }
        $array = $this->countChildrensDistintDivandText($div);
        if ($array['distint'] > 0) {
            return false;
        }
        if ($array['equals'] != 1) {
            return false;
        }
        $newDiv = $this->getElement($div->childNodes, 'div');
        if (!$this->validatefirs($ul, $newDiv)) {
            return false;
        }

        return true;
    }

    public function validatefirs(DOMElement $ul, DOMElement $div)
    {
        $array = $this->countChildrensDistintLiandText($ul);
        if ($array['distint'] > 0) {
            return false;
        }
        if ($array['equals'] != 1) {
            return false;
        }
        if (!$this->ulIsCorrect($ul, 'nav bs-sidenav')) {
            return false;
        }
        $li = $this->getElement($ul->childNodes, 'li');
        if (is_null($li)) {
            return false;
        }
        $id = $li->getAttribute('id');
        if (!$this->liIsCorrect($li, false, 'active xinitProyect')) {
            return false;
        }
        $a = $this->getElement($li->childNodes, 'a');
        if (is_null($a)) {
            return false;
        }
        if (!$this->aIsCorrect($a, $id)) {
            return false;
        }
        $array = $this->countChildrensDistintDivSectionandText($div);
        if ($array['distint'] > 0) {
            return false;
        }
        if (!$this->divIsCorrect($div, 'bs-docs-section')) {
            return false;
        }
        $newUl = $this->getElement($li->childNodes, 'ul');
        if (!$this->validatecontext($newUl, $div)) {
            return false;
        }

        return true;
    }

    public function getDivByIdLi(DOMNodeList $nodelist, $element)
    {
        foreach ($nodelist as $node) {
            if ($node->nodeName == 'div' && $node->getAttribute('id') == $element . '_context'
            ) {
                return $node;
            }
        }

        return null;
    }

    public function validatecontext(DOMElement $ul, DOMElement $div)
    {
        $next = true;
        if ($ul) {
            if (!$this->ulIsCorrect($ul, 'nav')) {
                return false;
            }
            $liChild = $ul->childNodes;
            $length = $liChild->length;
            for ($i = 0; $i < $length; $i++) {
                $li = $liChild->item($i);
                if ($li->nodeName == 'li') {
                    if (!$this->liIsCorrect($li, false)) {
                        return false;
                    }
                    $id = $li->getAttribute('id');
                    $a = $this->getElement($li->childNodes, 'a');
                    if (!$this->aIsCorrect($a, $id, false)) {
                        return false;
                    }
                    $newul = $this->getElement($li->childNodes, 'ul');
                    $newDiv = $this->getDivByIdLi($div->childNodes, $id);
                    if (is_null($newDiv)) {
                        return false;
                    }
                    if (!$this->divIsCorrect($newDiv, "bs-docs-section")) {
                        return false;
                    }
                    $next = $next && $this->validatecontext($newul, $newDiv);
                }
            }
        }

        return $next;
    }

    public function comprovarArchivo($dirName, $arrayFileValid)
    {
        $files = array_diff(scandir($dirName), array('.', '..', '.svn'));
        if (count($files) == 0) {
            return true;
        }
        $next = true;
        foreach ($files as $file) {
            if (is_file($dirName . $file)) {
                $partes = explode('.', $file);
                $ext = end($partes);
                if (!array_key_exists($ext, $arrayFileValid)) {
                    return false;
                }
            } else {
                if (is_dir($dirName . $file)) {
                    $next = $next && $this->comprovarArchivo($dirName . $file, $arrayFileValid);
                }
            }
        }

        return $next;
    }

    public function exportSumVerify($dirName, $nameProject)
    {
        $arraysDirmdCinco = array();
        $this->getArraysDirFile(
            $dirName . $nameProject,
            $nameProject,
            $arraysDirmdCinco
        );
        $dirJson = $dirName . $nameProject . '/zeolhelp.json';
        /*Contenido del json*/
        $contenido = json_encode($arraysDirmdCinco);
        $rsaF = new ZendExt_RSA_Facade();
        $contenido = $rsaF->encrypt($contenido);
        file_put_contents($dirJson, $contenido);
    }

    public function importSumVerify($dirName, $nameProject)
    {
        $dirJson = $dirName . $nameProject . '/zeolhelp.json';
        if (file_exists($dirJson)) {
            $contenido = file_get_contents($dirJson);
            $rsaF = new ZendExt_RSA_Facade();
            $contenido = $rsaF->decrypt($contenido);
            $arraysJson = json_decode($contenido, true);
            $arrayDirFile = array();
            $this->getArraysDirFile(
                $dirName . $nameProject,
                $nameProject,
                $arrayDirFile
            );
            if ($this->compareCheckSum($arraysJson, $arrayDirFile)) {
                return true;
            }
        }

        return false;
    }

    private function compareCheckSum($arraysOriginal, $newArrays)
    {
        $lengthFirst = count($arraysOriginal);
        $lengthSecund = count($newArrays);
        if ($lengthFirst != $lengthSecund) {
            return false;
        }
        for ($i = 0; $i < $lengthFirst; $i++) {
            if ($arraysOriginal[$i]['hashfile'] != $newArrays[$i]['hashfile']) {
                return false;
            }
        }

        return true;
    }

    public function getArraysDirFile($dirFile, $project, &$arrays)
    {
        $files = array_diff(scandir($dirFile), array('.', '..', '.svn'));
        foreach ($files as $file) {
            if (is_file($dirFile . '/' . $file) && $file != 'zeolhelp.json') {
                $arrays[] = array(
                    'dirfile' => $project . '/' . $file,
                    'hashfile' => hash_file("sha1", $dirFile . '/' . $file)
                );
            } else {
                if (is_dir($dirFile . '/' . $file)) {
                    $this->getArraysDirFile(
                        $dirFile . '/' . $file,
                        $project . '/' . $file,
                        $arrays
                    );
                }
            }
        }
    }

    public function escaparCadena($cadena)
    {
        $caracteres = array(
            '!',
            '$',
            '^',
            '&',
            '*',
            '(',
            ')',
            '|',
            '"',
            ';',
            ':',
            "'",
            '?',
            '¿',
            '>',
            '<',
            ','
        );
        foreach ($caracteres as $caracter) {
            $cadena = str_replace($caracter, '\\' . $caracter, $cadena);
        }

        return $cadena;
    }

    public function getNodoByPost(DOMNode $node, $pos, $nameNode)
    {
        $childrens = $node->childNodes;
        $posCount = 0;
        foreach ($childrens as $child) {
            if ($child->nodeName == $nameNode) {
                $posCount++;
            }
            if ($pos == $posCount) {
                return $child;
            }
        }

        return false;
    }
}