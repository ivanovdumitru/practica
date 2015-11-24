<?php

namespace B2B\BlogBundle\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
/**
 * @Route("/info/{i}")
 * @Template()
 * 
 */
class InfoarticleController extends Controller{
    function indexAction($i){
        $connect = $this->get('database_connection');
        $info['infos'] = $connect->fetchAll("SELECT * FROM items where CompanyC=".$i);
        
        $data = [
              'info'=>$info['infos']
          ];
        
        return $this->render('B2BBlogBundle:Company:list.html_1.twig',compact('data')); 
    }
} 