
import csv
from fastapi import APIRouter, HTTPException
from decimal import Decimal
import time

import boto3
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
from datetime import datetime, timezone, timedelta
from typing import Optional
import logging
import sys
sys.setrecursionlimit(100)

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

resource = boto3.resource('dynamodb', region_name='ap-northeast-2')
dynamodb = boto3.client('dynamodb', region_name='ap-northeast-2')  # 리전 설정


router = APIRouter()

def get_current_log(resource_type) :
    table = resource.Table(resource_type)
    
    # 현재 시간 가져오기
    current_time = time.time()  # 현재 Unix Timestamp

    # 타임스탬프 범위 설정 (예: 최근 1시간 데이터)
    start_time = Decimal(str(int(current_time - (60 * 60 * 300))))  # 300시간 전
    end_time = Decimal(str(int(current_time)))               # 현재 시간

    response = table.scan(
        FilterExpression=Attr('sort_key').between(start_time, end_time)
    )
    sorted_items = sorted(response['Items'], key=lambda x: x['sort_key'])

    return sorted_items


def get_current_process(resource_type, time_value=None):
    """
    resource_type: DynamoDB 테이블 이름
    time_value: 특정 타임스탬프 값 (옵션)
    """
    table = resource.Table(resource_type+"_process")
    
    # time_value가 존재하면 해당 값으로 조회
    if time_value:
        # DynamoDB에서 sort_key가 특정 값과 일치하는 항목 조회
        #date_obj = datetime.strptime(time_value, '%Y-%m-%d %H:%M:%S.%f')  # 정확한 포맷
        #date_obj = date_obj.replace(tzinfo=timezone.utc)
        # datetime 객체를 유닉스 타임으로 변환 (밀리초 포함)
        #unix_time = round(date_obj.timestamp(), 3)  # 소수점 3자리까지 유지
        #print(unix_time)

        response = table.query(
        KeyConditionExpression=boto3.dynamodb.conditions.Key('time_stamp').eq(str(time_value)) &
                               boto3.dynamodb.conditions.Key('sort_key').eq(Decimal(time_value)),
        ScanIndexForward=False  # 내림차순 정렬
    )

        #response = table.query(
        #    KeyConditionExpression=Key('time_stamp').eq(str(unix_time)) & Key('sort_key').eq(Decimal(unix_time))
        #)
        items = response.get('Items', [])
        if items:
            return items[0]  # 첫 번째 결과 반환
        else:
            print("nothing to return")
            return {"message": "No data found for the given time."}
    
    # time_value가 없을 때: 최근 데이터 범위 조회
    else:
        # 현재 시간 가져오기
        current_time = time.time()  # 현재 Unix Timestamp

        # 타임스탬프 범위 설정 (예: 최근 1시간 데이터)
        start_time = Decimal(str(int(current_time - (60 * 60 * 300))))  # 1시간 전
        end_time = Decimal(str(int(current_time)))                     # 현재 시간

        # FilterExpression으로 범위 지정
        response = table.scan(
            FilterExpression=Attr('sort_key').between(start_time, end_time)
        )

        # sort_key 기준으로 정렬 후 최근 데이터 반환
        items = response.get('Items', [])
        if items:
            sorted_items = sorted(items, key=lambda x: x['sort_key'])[-1]
            return sorted_items
        else:
            return {"message": "No data found in the recent range."}

'''
def convert_unix_to_korean_time(unix_timestamp):
    # 문자열을 정수로 변환
    unix_timestamp = float(unix_timestamp)
    # UTC에서 9시간을 더해 한국 시간으로 변환
    korean_time = datetime.fromtimestamp(unix_timestamp, tz=timezone.utc) + timedelta(hours=9)
    return korean_time.strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]  # 밀리초까지 포함'''

def get_cpu(resource):
    data = get_current_log(resource)
    #print("Fetched data from DynamoDB:", data)  # 디버깅 로그
    cpu_usage = []
    time_stamp = []
    for i in data:
        if 'cpu_percent' not in i or 'time_stamp' not in i:
            print(f"Skipping item due to missing keys: {i}")
            continue
        cpu_usage.append(float(i['cpu_percent']))
        time_stamp.append(i['time_stamp'])
    return cpu_usage, time_stamp

def get_process(resource_type, label=None) :
    data = get_current_process(resource_type, label)
    
    percent = []
    p_name = []

    print(data)
    for i in range(1,6) : 
        t, pid, pname, val = data[f"p{i}"].split(",")[:4]
        percent.append(val)
        p_name.append(pname)

    return [float(x) for x in percent], p_name



@router.get("/data_response")
async def get_chart_data(resource : str):
    # resource 값을 로깅
    logger.info(f"Received resource: {resource}")
    usage, time_stamp = get_cpu(resource)
    return {
        "labels": time_stamp[:20],
        "values": usage[:20],
    }


@router.get("/process_response")
async def get_pie_data(resource: str, label: Optional[str] = None):
    """
    라벨(label)을 쿼리 파라미터로 받아 데이터를 반환하는 API 엔드포인트
    - label이 제공되지 않으면 기본 데이터를 반환합니다.
    """
    percent, p_name = get_process(resource, label)
    return {
        "labels": p_name,
        "values": percent,
    }




'''
@router.get("/process_response")
async def get_pie_data():
    percent, p_name = get_process()
    return {
        "labels": p_name,
        "values": percent,
    }
'''


